import { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/Messages';
import { useAsync } from '../../hooks/useAsync';
import { streamChatMessage } from '../../api/chat';
import { useSessionChat } from '../../hooks/useChat';
import type { MessageResponse } from '../../types/api';

interface SessionChatProps {
  sessionId: number;
  onMessageCountsChange?: (counts: { total: number; user: number }) => void;
}

export const SessionChat = ({ sessionId, onMessageCountsChange }: SessionChatProps) => {
  const { messages, loading, error, addMessage, updateMessage, replaceMessage } = useSessionChat(sessionId);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const abortRef = useRef<AbortController | null>(null);

  const sendMessageAsync = useAsync(async (): Promise<void> => {
    const trimmedMessage = inputValue.trim();
    const userMessage: MessageResponse = {
      id: Date.now(),
      role: 'user',
      content: trimmedMessage,
      created_at: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInputValue('');

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const tempAgentId = Date.now() + 1;
    const tempAgentMessage: MessageResponse = {
      id: tempAgentId,
      role: 'agent',
      content: '',
      created_at: new Date().toISOString(),
    };
    addMessage(tempAgentMessage);

    await streamChatMessage(
      sessionId,
      trimmedMessage,
      (event) => {
        if (event.type === 'token') {
          updateMessage(tempAgentId, (msg) => ({ ...msg, content: `${msg.content}${event.content}` }));
          return;
        }
        if (event.type === 'done') {
          replaceMessage(tempAgentId, event.message);
          return;
        }
        if (event.type === 'error') {
          updateMessage(tempAgentId, (msg) => ({
            ...msg,
            content: msg.content || 'Failed to generate a response.',
          }));
        }
      },
      abortRef.current.signal,
    );
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await sendMessageAsync.execute();
    } catch {
      // Error handled by useAsync
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!onMessageCountsChange) return;
    const userCount = messages.filter((m) => m.role === 'user').length;
    onMessageCountsChange({ total: messages.length, user: userCount });
  }, [messages, onMessageCountsChange]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return (
    <Card>
      <h3 className="text-xl font-semibold text-white">Meditation Guidance Chat</h3>
      <p className="mt-2 text-sm text-slate-400">
        Share what you're feeling, what you want help with, and how long you'd like the meditation to be.
      </p>

      {error && <ErrorMessage message={error} className="mt-4" />}
      {sendMessageAsync.error && <ErrorMessage message={sendMessageAsync.error} className="mt-4" />}

      <div className="mt-4 space-y-4 max-h-96 overflow-y-auto rounded-2xl bg-slate-950/80 p-4">
        {loading ? (
          <Loading message="Loading messages..." size="sm" />
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Start a conversation!</p>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <p className="text-sm">
                    {msg.content || (msg.role === 'agent' ? '…' : '')}
                  </p>
                  <p className="mt-1 text-xs opacity-75">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
        <Input
          placeholder="Ask for guidance or support..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={sendMessageAsync.loading}
        />
        <Button
          type="submit"
          loading={sendMessageAsync.loading}
          className="w-full"
        >
          Send Message
        </Button>
      </form>
    </Card>
  );
};
