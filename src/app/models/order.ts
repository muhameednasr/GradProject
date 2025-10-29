import { OrderItem, OrderItemResponse } from './order-item';

export interface Order {
  id: number;
  status: string;
  customerId: number;
  customerName?: string;
  cashierId: number;
  cashierName?: string;
  captainId: number;
  captainName?: string;
  waiterId: number;
  waiterName?: string;
  tableId: number;
  area?: string;
  date: Date;
  orderItems: OrderItem[];
  total?: number;
}

export interface CreateOrderRequest {
  status: string;
  customerId: number;
  cashierId: number;
  captainId: number;
  waiterId: number;
  tableId: number;
  orderItems: Array<{
    itemId: number;
    quantity: number;
    sizeId: number;
  }>;
}
