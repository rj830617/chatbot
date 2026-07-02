import { useEffect, useState } from 'react';
import { useAsync } from './useAsync';
import { getSessionMessages } from '../api/chat';
import type { MessageResponse } from '../types/api';

export const useSessionChat = (sessionId: number | null) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const loadMessagesAsync = useAsync(async (): Promise<MessageResponse[]> => {
    if (!sessionId) return [];
    return await getSessionMessages(sessionId);
  });

  useEffect(() => {
    if (sessionId) {
      loadMessagesAsync.execute().then(setMessages).catch(() => {});
    }
  }, [sessionId]);

  const addMessage = (message: MessageResponse) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (id: number, updater: (message: MessageResponse) => MessageResponse) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? updater(msg) : msg)));
  };

  const replaceMessage = (oldId: number, next: MessageResponse) => {
    setMessages((prev) => prev.map((msg) => (msg.id === oldId ? next : msg)));
  };

  return {
    messages,
    loading: loadMessagesAsync.loading,
    error: loadMessagesAsync.error,
    refetch: loadMessagesAsync.execute,
    addMessage,
    updateMessage,
    replaceMessage,
  };
};
