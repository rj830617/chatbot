import { post } from './client';
import type { SessionResponse } from '../types/api';

export async function createSession(): Promise<SessionResponse> {
  return post('/session/create', {});
}
