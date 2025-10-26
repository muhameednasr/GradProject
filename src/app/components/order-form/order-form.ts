import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/item';
import { CreateOrderRequest } from '../../models/order';
import { OrderService } from '../../shared/order-service';
import { ItemService } from '../../shared/item-service';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user-service';
import { User } from '../../models/user';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderFormComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error = '';
  users: User[] = [];
  order: CreateOrderRequest = {
    status: 'Pending',
    customerId: 1,
    cashierId: 2,
    captainId: 1,
    waiterId: 1,
    tableId: 1,
    orderItems: [],
  };

  constructor(
    private orderService: OrderService,
    private itemService: ItemService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (err) => {
        this.error = 'Failed to load items.';
        console.error(err);
      },
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.error = 'failed to load users';
        console.error(err);
      },
    });
  }

  addItem(itemId: number): void {
    const existingItem = this.order.orderItems.find((oi) => oi.itemId === itemId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.order.orderItems.push({ itemId, quantity: 1 });
    }
  }

  removeItem(itemId: number): void {
    this.order.orderItems = this.order.orderItems.filter((oi) => oi.itemId !== itemId);
  }

  getItemName(itemId: number): string {
    return this.items.find((i) => i.id === itemId)?.name || '';
  }

  submitOrder(): void {
    if (this.order.orderItems.length === 0) {
      this.error = 'Please add at least one item to the order.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.orderService.create(this.order).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.error = 'Failed to create order.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}
