import { OrderItemResponse } from "./order-item";

export interface Order {
  id: number;
  orderDate: string;
  customerName: string;
  cashierName: string;
  status: string;
  total: number;
  items: OrderItemResponse[];
}

export interface CreateOrderRequest {
  status: string;
  customerId: number;
  cashierId: number;
  orderItems: Array<{
    itemId: number;
    quantity: number;
  }>;
}