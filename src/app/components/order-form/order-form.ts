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
    sizeId: string;
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
    console.log('Item clicked:', itemId);
    const selectedItem = this.items.find((item) => item.id === itemId);
    console.log('Selected item:', selectedItem);

    if (!selectedItem) {
      this.error = 'Item not found';
      return;
    }

    const existingItemIndex = this.tempOrderItems.findIndex((item) => item.itemId === itemId);

    if (existingItemIndex !== -1) {
      this.tempOrderItems[existingItemIndex].quantity += 1;
    } else {
      this.tempOrderItems = [
        ...this.tempOrderItems,
        {
          itemId: itemId,
          quantity: 1,
          sizeId: 'M',
        },
      ];
    }

    console.log('Current order items:', this.tempOrderItems);
  }

  removeItem(itemId: number): void {
    this.tempOrderItems = this.tempOrderItems.filter((item) => item.itemId !== itemId);
  }

  getItemName(itemId: number): string {
    const item = this.items.find((item) => item.id === itemId);
    return item ? item.name : 'Unknown Item';
  }
  getItemPrice(itemId: number): number {
    const item = this.items.find((item) => item.id === itemId);
    return item ? item.price : 0;
  }

  getSizeLabel(size: string): string {
    const sizeLabels: { [key: string]: string } = {
      S: 'Small',
      M: 'Medium',
      L: 'Large',
    };
    return sizeLabels[size] || size;
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
    const allItemsHaveSize = this.tempOrderItems.every((item) => item.sizeId && item.sizeId !== '');

    if (!allItemsHaveSize) {
      this.error = 'Please select sizes for all items';
      return;
    }

    this.loading = true;
    this.error = '';

    // Create the order payload with proper type conversion
    const orderPayload: CreateOrderRequest = {
      status: this.order.status,
      customerId: +this.order.customerId,
      cashierId: +this.order.cashierId,
      captainId: +this.order.captainId,
      waiterId: +this.order.waiterId,
      tableId: +this.order.tableId,
      orderItems: this.tempOrderItems.map((item) => ({
        itemId: +item.itemId, // Convert to number
        quantity: +item.quantity,
        sizeId: this.getSizeId(item.sizeId), // Already returns a number
      })),
    };

    // Add validation logging
    console.log('Order payload:', {
      ...orderPayload,
      items: orderPayload.orderItems.map((item) => ({
        ...item,
        itemId: typeof item.itemId === 'number' ? item.itemId : 'undefined',
      })),
    });

    // Validate items have valid IDs
    if (!orderPayload.orderItems.every((item) => item.itemId > 0)) {
      this.error = 'Invalid item data - missing item IDs';
      this.loading = false;
      return;
    }

    this.orderService.create(orderPayload).subscribe({
      next: (response) => {
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.error = err.error?.message || 'Failed to create order';
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}
