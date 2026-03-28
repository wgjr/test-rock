import { api } from './client';
import type { ApiMessageResponse } from '../types/api';
import type { Product, ProductPayload, ProductsQuery } from '../types/product';

export async function getProducts(query: ProductsQuery) {
  const { data } = await api.get<ApiMessageResponse<Product[]>>('/products', {
    params: query,
  });

  return {
    items: data.data,
    meta: data.meta,
  };
}

export async function getProductById(id: string) {
  const { data } = await api.get<ApiMessageResponse<Product>>(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload: ProductPayload) {
  const { data } = await api.post<ApiMessageResponse<Product>>('/products', payload);
  return data.data;
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const { data } = await api.put<ApiMessageResponse<Product>>(`/products/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`);
}
