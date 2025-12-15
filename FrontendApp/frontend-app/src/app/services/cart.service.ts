import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/models';
import { ProductResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'cart_items';
  private _items$ = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Load cart from localStorage on initialization
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          this._items$.next(items);
        } catch (e) {
          console.error('Failed to parse saved cart', e);
        }
      }
    }
  }

  private saveToLocalStorage(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    }
  }

  getCartItems(): CartItem[] {
    return this._items$.getValue();
  }

  addToCart(product: ProductResponse): void {
    const currentItems = this._items$.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ product: product, quantity: 1 });
    }

    const updatedItems = [...currentItems];
    this._items$.next(updatedItems);
    this.saveToLocalStorage(updatedItems);
  }

    updateQuantity(productId: number, quantity: number): void {
    const currentItems = this._items$.getValue();
    const itemToUpdate = currentItems.find(item => item.product.id === productId);

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
    }

    const updatedItems = [...currentItems];
    this._items$.next(updatedItems);
    this.saveToLocalStorage(updatedItems);
  }

  removeItem(productId: number): void {
    const currentItems = this._items$.getValue().filter(item => item.product.id !== productId);
    this._items$.next(currentItems);
    this.saveToLocalStorage(currentItems);
  }

  clearCart(): void {
    this._items$.next([]);
    this.saveToLocalStorage([]);
  }

  getTotalAmount(): number {
    return this._items$.getValue().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
