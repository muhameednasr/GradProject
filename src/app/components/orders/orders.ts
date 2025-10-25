import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../shared/order-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})


export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';
  selectedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Make sure your API is running.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteOrder(id: number): void {
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.orderService.delete(id).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        this.error = 'Failed to delete order.';
        console.error(err);
      }
    });
  }

  toggleOrderDetails(orderId: number): void {
    this.selectedOrderId = this.selectedOrderId === orderId ? null : orderId;
  }

  isOrderExpanded(orderId: number): boolean {
    return this.selectedOrderId === orderId;
  }
}