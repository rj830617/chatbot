import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthTokenResponse, UserResponse } from '../types/api';
import { fetchMe, logout, requestEmailCode, verifyEmailCode } from '../api/auth';

interface AuthContextValue {
  user: UserResponse | null;
  loading: boolean;
  authenticated: boolean;
  needsOnboarding: boolean;
  requestLoginCode: (email: string) => Promise<void>;
  signInWithCode: (email: string, code: string) => Promise<{ user: UserResponse; is_exists: boolean }>;
  setAuthenticatedUser: (user: UserResponse) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';
const emailKey = 'user_email';
const onboardingKey = 'needs_onboarding';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(
    localStorage.getItem(onboardingKey) === 'true',
  );

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem(accessTokenKey);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchMe();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth refresh failed', error);
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
        localStorage.removeItem(emailKey);
        localStorage.removeItem(onboardingKey);
        setNeedsOnboarding(false);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const requestLoginCode = async (email: string) => {
    await requestEmailCode(email);
    localStorage.setItem(emailKey, email);
  };

  const signInWithCode = async (email: string, code: string) => {
    const tokenResponse: AuthTokenResponse = await verifyEmailCode(email, code);
    localStorage.setItem(accessTokenKey, tokenResponse.access_token);
    localStorage.setItem(refreshTokenKey, tokenResponse.refresh_token);
    localStorage.setItem(emailKey, email);

    const onboarding = !tokenResponse.is_exists;
    localStorage.setItem(onboardingKey, onboarding ? 'true' : 'false');
    setNeedsOnboarding(onboarding);

    const currentUser = await fetchMe();
    setUser(currentUser);
    return { user: currentUser, is_exists: tokenResponse.is_exists };
  };

  const setAuthenticatedUser = (user: UserResponse) => {
    setUser(user);
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Logout request failed, continuing to clear local state.', error);
    } finally {
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(refreshTokenKey);
      localStorage.removeItem(emailKey);
      localStorage.removeItem(onboardingKey);
      setUser(null);
      setNeedsOnboarding(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticated: Boolean(user),
      needsOnboarding,
      requestLoginCode,
      signInWithCode,
      setAuthenticatedUser,
      signOut,
    }),
    [user, loading, needsOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
