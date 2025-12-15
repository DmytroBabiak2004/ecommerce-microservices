import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartItem } from '../../models/models';
import { SharedMaterialModule } from '../../shared/shared-material.module';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;

    constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.items$;
  }

    ngOnInit(): void {}

  updateQuantity(productId: number, event: any): void {
    const quantity = event.target.value;
    this.cartService.updateQuantity(productId, parseInt(quantity, 10));
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  getTotalAmount(): number {
    return this.cartService.getTotalAmount();
  }

  createOrder(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.snackBar.open('You must be logged in to create an order.', 'Close', { duration: 3000 });
      return;
    }

    const cartItems = this.cartService.getCartItems();
    const orderRequest = {
      userId: userId,
      orderItems: cartItems.map((item: CartItem) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price
      }))
    };

    this.ordersService.createOrder(orderRequest).subscribe({
      next: () => {
        this.snackBar.open('Order created successfully!', 'Close', { duration: 3000 });
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.snackBar.open('Failed to create order.', 'Close', { duration: 3000 });
        console.error('Error creating order', err);
      }
    });
  }
}
