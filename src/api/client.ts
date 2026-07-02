import { API_BASE_URL } from '../constants';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = data?.detail || data?.message || response.statusText || 'Request failed';
    throw new Error(error);
  }

  return data as T;
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  return true;
}

async function fetchWithReauth<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (response.status === 401 && path !== '/auth/refresh') {
    const refreshed = await refreshTokens();
    if (refreshed) {
      const retryResponse = await fetch(`${API_BASE_URL}${path}`, init);
      return parseResponse<T>(retryResponse);
    }
  }

  return parseResponse<T>(response);
}

export async function get<T>(path: string): Promise<T> {
  return fetchWithReauth<T>(`${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  return fetchWithReauth<T>(`${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  return fetchWithReauth<T>(`${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
}

export async function postForm<T>(path: string, formData: FormData): Promise<T> {
  return fetchWithReauth<T>(`${path}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: formData,
  });
}
