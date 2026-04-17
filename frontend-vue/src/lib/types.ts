export type User = {
  id?: number;
  name?: string;
  email: string;
  role?: string;
};

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  category?: Category | null;
  created_at: string;
  updated_at: string;
};

export type ProductPayload = {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string;
};

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
