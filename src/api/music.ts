import { get } from './client';
import type { MusicResponse } from '../types/api';

export async function listMusic(): Promise<MusicResponse[]> {
  return get('/music/list');
}

export async function getMusic(musicId: number): Promise<MusicResponse> {
  return get(`/music/${musicId}`);
}
