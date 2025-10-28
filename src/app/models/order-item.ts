export interface OrderItem {
  itemId: number;
  quantity: number;
  name?: string;
  price?: number;
  sizeId?: string;
}

export interface OrderItemResponse {
  itemId: number; // ADD THIS - critical for updates
  name: string;
  quantity: number;
  price: number;
  sizeId: string;
  isPayed?: boolean; // ADD THIS if you want pay functionality
}
