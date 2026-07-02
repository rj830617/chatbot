import { post, get } from './client';
import type { AuthTokenResponse, UserResponse } from '../types/api';

export interface SignInResult {
  user: UserResponse;
  is_exists: boolean;
}

export async function requestEmailCode(email: string): Promise<{ message: string }> {
  return post('/auth/email/request-code', { email });
}

export async function verifyEmailCode(email: string, code: string): Promise<AuthTokenResponse> {
  return post('/auth/email/verify-code', { email, code });
}

export async function googleSignIn(id_token: string): Promise<SignInResult> {
  const authResponse = await post<AuthTokenResponse>('/auth/google', { id_token });
  localStorage.setItem('access_token', authResponse.access_token);
  localStorage.setItem('refresh_token', authResponse.refresh_token);
  const user = await fetchMe();
  return { user, is_exists: authResponse.is_exists };
}

export async function appleSignIn(identity_token: string, email?: string, name?: string): Promise<SignInResult> {
  const authResponse = await post<AuthTokenResponse>('/auth/apple', {
    identity_token,
    email,
    name,
  });
  localStorage.setItem('access_token', authResponse.access_token);
  localStorage.setItem('refresh_token', authResponse.refresh_token);
  const user = await fetchMe();
  return { user, is_exists: authResponse.is_exists };
}

export async function fetchMe(): Promise<UserResponse> {
  return get('/users/me');
}

export async function refreshAccessToken(refresh_token: string): Promise<AuthTokenResponse> {
  return post('/auth/refresh', { refresh_token });
}

export async function logout(): Promise<{ message: string }> {
  return post('/auth/logout', {});
}
