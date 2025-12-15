import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products';
import { OrdersComponent } from './components/orders/orders';
import { LoginComponent } from './components/auth/login.component';
import { CartComponent } from './components/cart/cart.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' }
];