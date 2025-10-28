export interface OrderItem {
  itemId: number;
  quantity: number;
  name?: string;
  price?: number;
  code?: string;
}

export interface OrderItemResponse {
  name: string;
  quantity: number;
  price: number;
  code: string;
}
