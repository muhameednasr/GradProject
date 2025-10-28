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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.html',
  styleUrls: ['./order-form.css'],
})
export class OrderFormComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error = '';
  cashiers: User[] = [];
  captains: User[] = [];
  waiters: User[] = [];
  availableSizes: string[] = ['S', 'M', 'L'];

  // Temporary order items for UI (includes code as string)
  tempOrderItems: Array<{
    itemId: number;
    quantity: number;
    code: string;
  }> = [];

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
    this.loadCashiers();
    this.loadCaptains();
    this.loadWaiters();
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

  loadCashiers(): void {
    this.userService.getCashiers().subscribe({
      next: (data) => {
        this.cashiers = data;
      },
      error: (err) => {
        this.error = 'Failed to load cashiers';
        console.error(err);
      },
    });
  }

  loadWaiters(): void {
    this.userService.getWaiters().subscribe({
      next: (data) => {
        this.waiters = data;
      },
      error: (err) => {
        this.error = 'Failed to load waiters';
        console.error(err);
      },
    });
  }

  loadCaptains(): void {
    this.userService.getCaptains().subscribe({
      next: (data) => {
        this.captains = data;
      },
      error: (err) => {
        this.error = 'Failed to load captains';
        console.error(err);
      },
    });
  }

  addItem(itemId: number): void {
    const existingItem = this.tempOrderItems.find((oi) => oi.itemId === itemId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.tempOrderItems.push({
        itemId,
        quantity: 1,
        code: '', // Initialize as empty string
      });
    }
  }

  removeItem(itemId: number): void {
    this.tempOrderItems = this.tempOrderItems.filter((oi) => oi.itemId !== itemId);
  }

  getItemName(itemId: number): string {
    return this.items.find((i) => i.id === itemId)?.name || '';
  }

  getSizeLabel(code: string): string {
    const sizeLabels: { [key: string]: string } = {
      S: 'Small',
      M: 'Medium',
      L: 'Large',
    };
    return sizeLabels[code] || code;
  }

  getSizeId(code: string): number {
    const sizeMap: { [key: string]: number } = {
      S: 1,
      M: 2,
      L: 3,
    };
    return sizeMap[code] || 2; // Default to Medium
  }

  submitOrder(): void {
    // Validate order has items
    if (this.tempOrderItems.length === 0) {
      this.error = 'Please add at least one item to the order.';
      return;
    }

    // Validate all items have sizes
    const allItemsHaveSize = this.tempOrderItems.every((item) => item.code && item.code !== '');

    if (!allItemsHaveSize) {
      this.error = 'Please select size for all items.';
      return;
    }

    this.loading = true;
    this.error = '';

    // Create the order payload with sizeId
    const orderPayload: CreateOrderRequest = {
      status: this.order.status,
      customerId: this.order.customerId,
      cashierId: this.order.cashierId,
      captainId: this.order.captainId,
      waiterId: this.order.waiterId,
      tableId: this.order.tableId,
      orderItems: this.tempOrderItems.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        sizeId: this.getSizeId(item.code), // Convert code to sizeId for backend
      })),
    };

    console.log('Sending order:', orderPayload);

    this.orderService.create(orderPayload).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.error = err.error?.message || err.message || 'Failed to create order.';
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}
