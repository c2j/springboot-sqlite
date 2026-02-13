// Order types

export interface Order {
  id: number;
  clientId: number;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

export interface OrderItem {
  productCode: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderResultResponseDTO {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  orders: Order[];
}
