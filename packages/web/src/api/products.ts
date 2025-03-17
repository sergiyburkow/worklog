import { api } from '../lib/api';
import { Product } from '../types/product';

export const productsApi = {
  getProjectProducts: (projectId: string) => {
    return api.get<Product[]>(`/products/project/${projectId}`);
  },
  
  deleteProduct: (productId: string) => {
    return api.delete(`/products/${productId}`);
  },

  updateProduct: (productId: string, data: { code: string }) => {
    return api.put<Product>(`/products/${productId}`, data);
  },

  createProduct: (data: { code: string; projectId: string }) => {
    return api.post<Product>('/products', data);
  },
}; 