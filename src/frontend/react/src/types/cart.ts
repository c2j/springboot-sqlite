// Shopping cart types

export interface CartItem {
  id: number;
  productCode: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hasImage: boolean;
}

export interface ShoppingCart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface ShoppingCartResultResponseDTO {
  items: CartItem[];
  total: number;
}

export interface AddToCartRequest {
  productCode: number;
  quantity: number;
}

export interface BuyCartRequest {
  paymentMethod: 'CASH' | 'VISA' | 'MASTERCARD' | 'PAYPAL';
}
