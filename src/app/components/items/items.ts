import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../shared/item-service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-items',
  imports: [CommonModule],
  templateUrl: './items.html',
  styleUrl: './items.css',
})


export class ItemsComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error = '';

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.error = '';
    this.itemService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load items. Make sure your API is running.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}