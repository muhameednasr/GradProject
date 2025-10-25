import { OrderItemResponse } from './order-item';

export interface Order {
  id: number;
  orderDate: string;
  customerName: string;
  cashierName: string;
  captainName: string;
  waiterName: string;
  tableId: number;
  area: string;
  status: string;
  total: number;
  items: OrderItemResponse[];
}

export interface CreateOrderRequest {
  status: string;
  customerId: number;
  cashierId: number;
  captainId:number;
  waiterId:number;
  tableId: number;
  orderItems: Array<{
    itemId: number;
    quantity: number;
  }>;
}
