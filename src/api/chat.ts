import { get, getAuthHeaders } from './client';
import type { MessageResponse } from '../types/api';
import { API_BASE_URL } from '../constants';

export type ChatStreamEvent =
  | { type: 'token'; content: string }
  | { type: 'done'; message: MessageResponse }
  | { type: 'error'; detail: string };

export async function getSessionMessages(sessionId: number): Promise<MessageResponse[]> {
  return get(`/session/${sessionId}/messages`);
}

function parseErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data) {
    const detail = (data as { detail?: unknown }).detail;
    const message = (data as { message?: unknown }).message;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export async function streamChatMessage(
  sessionId: number,
  message: string,
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ content: message }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let error = response.statusText || 'Request failed';
    if (text) {
      try {
        error = parseErrorMessage(JSON.parse(text), error);
      } catch {
        error = text;
      }
    }
    throw new Error(error);
  }

  if (!response.body) {
    throw new Error('Streaming response body is unavailable.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let separatorIndex = buffer.indexOf('\n\n');
    while (separatorIndex !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);

      const lines = rawEvent.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice('data:'.length).trim();
        if (!data) continue;
        try {
          const parsed = JSON.parse(data) as ChatStreamEvent;
          if (parsed?.type) {
            onEvent(parsed);
          }
        } catch {
          // Ignore malformed chunks
        }
      }

      separatorIndex = buffer.indexOf('\n\n');
    }
  }
}
