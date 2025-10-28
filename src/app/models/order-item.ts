export interface OrderItem {
  itemId: number;
  quantity: number;
  name?: string;
  price?: number;
  sizeId?: string;
}

export interface OrderItemResponse {
  name: string;
  quantity: number;
  price: number;
  sizeId: string;
}
