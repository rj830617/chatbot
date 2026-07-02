import { get, put } from './client';
import type { UserResponse, UserPreferences, UserStatsResponse } from '../types/api';

export async function fetchUserProfile(): Promise<UserResponse> {
  return get('/users/me');
}

export async function updateUserProfile(data: { name?: string; email?: string }): Promise<UserResponse> {
  return put('/users/me', data);
}

export async function fetchUserStats(): Promise<UserStatsResponse> {
  return get('/users/me/stats');
}

export async function updateUserPreferences(data: UserPreferences): Promise<UserResponse> {
  return put('/users/me/preferences', data);
}
