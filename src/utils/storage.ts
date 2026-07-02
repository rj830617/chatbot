// Local storage utilities with type safety
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// Auth-specific storage
export const authStorage = {
  getAccessToken: (): string | null => storage.get('access_token'),
  setAccessToken: (token: string): void => storage.set('access_token', token),
  getRefreshToken: (): string | null => storage.get('refresh_token'),
  setRefreshToken: (token: string): void => storage.set('refresh_token', token),
  getUserEmail: (): string | null => storage.get('user_email'),
  setUserEmail: (email: string): void => storage.set('user_email', email),

  clear: (): void => {
    storage.remove('access_token');
    storage.remove('refresh_token');
    storage.remove('user_email');
  },
};