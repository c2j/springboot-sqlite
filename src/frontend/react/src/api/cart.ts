import apiClient from './client';
import type {
  ShoppingCartResultResponseDTO,
  AddToCartRequest,
  BuyCartRequest,
  Order,
  CartItem,
} from '@/types';

export const cartApi = {
  getShoppingCart: async (): Promise<ShoppingCartResultResponseDTO> => {
    const response = await apiClient.get<ShoppingCartResultResponseDTO>('/carts');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/carts', null, {
      params: {
        productCode: data.productCode,
        quantity: data.quantity,
      },
    });
    return response.data;
  },

  removeFromCart: async (cartId: number): Promise<void> => {
    await apiClient.delete(`/carts/${cartId}`);
  },

  buyCart: async (data: BuyCartRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/carts/buy', null, {
      params: {
        payment_method: data.paymentMethod,
      },
    });
    return response.data;
  },
};
