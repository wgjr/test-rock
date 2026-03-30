import { api } from './client';
import type { AuthPayload, User } from '../types/auth';

type RawAuthResponse = {
  success?: boolean;
  message?: string;
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
        }
      : {
          email: fallbackEmail,
        });

  if (!token) {
    throw new Error('A API não retornou um token de autenticação.');
  }

  return { token, user };
}

export async function login(payload: AuthPayload) {
  const { data } = await api.post<RawAuthResponse>('/auth/login', payload);
  return normalizeAuthResponse(data, payload.email);
}

export async function register(payload: AuthPayload) {
  const { data } = await api.post<RawAuthResponse>('/auth/register', payload);
  return normalizeAuthResponse(data, payload.email);
}
