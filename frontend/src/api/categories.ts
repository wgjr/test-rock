import { api } from './client';
import type { ApiMessageResponse } from '../types/api';
import type { Category } from '../types/category';

export async function getCategories() {
  const { data } = await api.get<ApiMessageResponse<Category[]>>('/categories');
  return data.data;
}

export async function createCategory(name: string) {
  const { data } = await api.post<ApiMessageResponse<Category>>('/categories', { name });
  return data.data;
}

export async function updateCategory(id: number, name: string) {
  const { data } = await api.put<ApiMessageResponse<Category>>(`/categories/${id}`, { name });
  return data.data;
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}`);
}
