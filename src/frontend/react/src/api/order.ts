import apiClient from './client';
import type { Order, OrderResultResponseDTO } from '@/types';

export const orderApi = {
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  getOrderDetails: async (orderId: number): Promise<OrderResultResponseDTO> => {
    const response = await apiClient.get<OrderResultResponseDTO>(`/orders/${orderId}/details`);
    return response.data;
  },
};
