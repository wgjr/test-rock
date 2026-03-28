export type User = {
  id?: number;
  name?: string;
  email: string;
};

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type AuthState = {
  token: string | null;
  user: User | null;
};
