import { Routes } from '@angular/router';
import { OrdersComponent } from './components/orders/orders';
import { OrderFormComponent } from './components/order-form/order-form';
import { ItemsComponent } from './components/items/items';

export const routes: Routes = [

    { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/new', component: OrderFormComponent },
  { path: 'items', component: ItemsComponent }
];
