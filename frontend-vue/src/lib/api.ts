import axios from 'axios';
import type { ApiResponse, Category, Product, ProductPayload } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export const storageKeys = {
  token: 'ecommerce.token',
  user: 'ecommerce.user',
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(storageKeys.token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(storageKeys.token);
      localStorage.removeItem(storageKeys.user);
      const path = window.location.pathname;
      if (!path.startsWith('/login') && !path.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export async function getCategories() {
  const { data } = await api.get<ApiResponse<Category[]>>('/categories');
  return data.data;
}

export async function createCategory(name: string) {
  const { data } = await api.post<ApiResponse<Category>>('/categories', { name });
  return data.data;
}

export async function updateCategory(id: number, name: string) {
  const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name });
  return data.data;
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}`);
}

export async function getProducts(query: Record<string, string | number>) {
  const { data } = await api.get<ApiResponse<Product[]>>('/products', { params: query });
  return {
    items: data.data,
    meta: data.meta,
  };
}

export async function getProductById(id: string | number) {
  const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: ProductPayload) {
  const { data } = await api.post<ApiResponse<Product>>('/products', payload);
  return data.data;
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`);
}
