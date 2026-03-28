import type { Category } from './category';

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  category: Category;
  created_at: string;
  updated_at: string;
};

export type ProductsQuery = {
  page?: number;
  search?: string;
  category?: string;
  per_page?: number;
  sort?: 'created_at' | 'name' | 'price';
  direction?: 'asc' | 'desc';
};

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
};
