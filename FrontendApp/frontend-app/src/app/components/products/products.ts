import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductResponse } from '../../models/models';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../shared/shared-material.module';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  isLoading = true;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  addToCart(product: ProductResponse): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart`, 'Close', {
      duration: 2000,
    });
  }

  ngOnInit(): void {
        this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    });
  }
}