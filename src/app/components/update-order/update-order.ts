import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../shared/order-service';
import { Order } from '../../models/order';

interface OrderItemWithState {
  itemId: number;
  name: string; // Direct properties
  quantity: number;
  price: number;
  sizeId: string;
  isPayed: boolean;
  item?: {
    // Optional nested item properties if they exist
    name: string;
    price: number;
  };
}

@Component({
  selector: 'app-update-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-order.html',
  styleUrls: ['./update-order.css'],
})
export class UpdateOrderComponent implements OnInit {
  orderId!: number;
  order: any;
  loading = false;
  error = '';
  availableSizes: string[] = ['S', 'M', 'L'];

  constructor(private router: Router, private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { order: any };

    if (state?.order) {
      // Map the order items to ensure consistent structure
      this.order = {
        ...state.order,
        orderItems: state.order.orderItems.map((item: any) => ({
          itemId: item.itemId,
          name: item.name || item.item?.name,
          quantity: item.quantity,
          price: item.price || item.item?.price,
          sizeId: item.sizeId || '1',
          isPayed: item.isPayed || false,
        })),
      };
      this.orderId = state.order.id;
    } else {
      this.router.navigate(['/orders']);
    }
  }

  ngOnInit(): void {
    // Order data already loaded from navigation state
  }

  getSizeCode(sizeId: string): string {
    const sizeMap: { [key: string]: string } = {
      '1': 'S',
      '2': 'M',
      '3': 'L',
    };
    return sizeMap[sizeId] || 'S';
  }

  getSizeLabel(size: string): string {
    const sizeLabels: { [key: string]: string } = {
      S: 'Small',
      M: 'Medium',
      L: 'Large',
    };
    return sizeLabels[size] || size;
  }

  updateItemSize(itemId: number, newSize: string): void {
    const item = this.order.orderItems.find((i: any) => i.itemId === itemId);
    if (item && !item.isPayed) {
      item.sizeId = this.getSizeId(newSize);
      this.updateOrder();
    }
  }

  getSizeId(code: string): string {
    const sizeMap: { [key: string]: string } = {
      S: '1',
      M: '2',
      L: '3',
    };
    return sizeMap[code] || '1';
  }

  payForItem(itemId: number): void {
    const item = this.order.orderItems.find((i: any) => i.itemId === itemId);
    if (item && !item.isPayed) {
      item.isPayed = true;
      this.updateOrder();
    }
  }

  updateOrder(): void {
    this.loading = true;
    this.orderService.update(this.orderId, this.order).subscribe({
      next: (response) => {
        this.order = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update order';
        this.loading = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/orders']);
  }
}
