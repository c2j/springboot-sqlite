import apiClient from './client';
import type {
  ProductResponseDTO,
  ProductCreateRequest,
  PaginatedResponse,
} from '@/types';

export const productApi = {
  getAllProducts: async (
    searchPhrase?: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ProductResponseDTO>> => {
    const response = await apiClient.get<ProductResponseDTO[]>('/stocks', {
      params: { searchPhrase, page, size },
    });
    
    // Transform to paginated response format
    return {
      content: response.data,
      totalElements: response.data.length,
      totalPages: 1,
      size,
      number: page,
      first: page === 0,
      last: true,
    };
  },

  getProduct: async (code: number): Promise<ProductResponseDTO> => {
    const response = await apiClient.get<ProductResponseDTO>(`/stocks/${code}`);
    return response.data;
  },

  getProductImage: (code: number): string => {
    return `${apiClient.defaults.baseURL}/stocks/${code}/image`;
  },

  createProduct: async (data: ProductCreateRequest): Promise<ProductResponseDTO> => {
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('category', data.category.toString());
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity.toString());
    formData.append('status', data.status);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post<ProductResponseDTO>('/stocks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (code: number, data: ProductCreateRequest): Promise<ProductResponseDTO> => {
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('category', data.category.toString());
    formData.append('price', data.price.toString());
    formData.append('quantity', data.quantity.toString());
    formData.append('status', data.status);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.put<ProductResponseDTO>(`/stocks/${code}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (code: number): Promise<void> => {
    await apiClient.delete(`/stocks/${code}`);
  },
};
