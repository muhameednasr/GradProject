export interface OrderItem {
  itemId: number;
  quantity: number;
  name?: string;
  price?: number;
}

export interface OrderItemResponse {
  name: string;
  quantity: number;
  price: number;
}