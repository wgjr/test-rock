export type User = {
  id?: number;
  name?: string;
  email: string;
  role?: 'user' | 'admin';
};

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
};

export type AuthState = {
  token: string | null;
  user: User | null;
};
