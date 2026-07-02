import { get, post } from './client';
import type { MeditationResponse } from '../types/api';

export async function startMeditation(sessionId: number): Promise<MeditationResponse> {
  return post(`/meditation/start?session_id=${sessionId}`, {});
}

export async function getMeditation(meditationId: number): Promise<MeditationResponse> {
  return get(`/meditation/${meditationId}`);
}

export async function listMeditations(): Promise<MeditationResponse[]> {
  return get('/meditation/list?limit=20&offset=0');
}

export async function toggleLikeMeditation(meditationId: number): Promise<MeditationResponse> {
  return post(`/meditation/${meditationId}/like`, {});
}
