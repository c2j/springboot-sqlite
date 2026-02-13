import apiClient from './client';
import type { Category } from '@/types';

export const lookupApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/lookup/categories');
    return response.data;
  },
};
