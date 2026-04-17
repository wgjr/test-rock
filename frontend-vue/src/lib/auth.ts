import { reactive, computed } from 'vue';
import { api, storageKeys } from './api';
import type { AuthPayload, User } from './types';

type RawAuthResponse = {
  token?: string;
  access_token?: string;
  plainTextToken?: string;
  user?: User;
  data?: {
    token?: string;
    access_token?: string;
    plainTextToken?: string;
    user?: User;
    email?: string;
    name?: string;
    id?: number;
    role?: string;
  };
};

function normalizeAuthResponse(response: RawAuthResponse, fallbackEmail: string) {
  const token =
    response.token ??
    response.access_token ??
    response.plainTextToken ??
    response.data?.token ??
    response.data?.access_token ??
    response.data?.plainTextToken ??
    null;

  const user =
    response.user ??
    response.data?.user ??
    (response.data?.email
      ? {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }
      : { email: fallbackEmail });

  if (!token) {
    throw new Error('A API não retornou um token de autenticação.');
  }

  return { token, user };
}

function readUser() {
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

const state = reactive({
  token: localStorage.getItem(storageKeys.token) as string | null,
  user: readUser() as User | null,
});

function persist() {
  if (state.token) {
    localStorage.setItem(storageKeys.token, state.token);
  } else {
    localStorage.removeItem(storageKeys.token);
  }

  if (state.user) {
    localStorage.setItem(storageKeys.user, JSON.stringify(state.user));
  } else {
    localStorage.removeItem(storageKeys.user);
  }
}

export const auth = {
  state,
  isAuthenticated: computed(() => Boolean(state.token)),
  async login(payload: AuthPayload) {
    const { data } = await api.post<RawAuthResponse>('/auth/login', payload);
    const response = normalizeAuthResponse(data, payload.email);
    state.token = response.token;
    state.user = response.user;
    persist();
  },
  async register(payload: AuthPayload) {
    const { data } = await api.post<RawAuthResponse>('/auth/register', payload);
    const response = normalizeAuthResponse(data, payload.email);
    state.token = response.token;
    state.user = response.user;
    persist();
  },
  logout() {
    state.token = null;
    state.user = null;
    persist();
  },
};
