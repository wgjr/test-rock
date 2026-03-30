import { createContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/auth';
import { storageKeys } from '../api/client';
import type { AuthPayload, AuthState, User } from '../types/auth';

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: AuthPayload) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readInitialUser() {
  const rawUser = localStorage.getItem(storageKeys.user);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(storageKeys.token));
  const [user, setUser] = useState<User | null>(readInitialUser);

  useEffect(() => {
    if (token) {
      localStorage.setItem(storageKeys.token, token);
    } else {
      localStorage.removeItem(storageKeys.token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKeys.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(storageKeys.user);
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      async login(payload) {
        const response = await loginRequest(payload);
        setToken(response.token);
        setUser(response.user);
      },
      async register(payload) {
        const response = await registerRequest(payload);
        setToken(response.token);
        setUser(response.user);
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
