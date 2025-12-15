import { Component, Inject, PLATFORM_ID, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedMaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartItemCount$: Observable<number>;
  private _isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cartItemCount$ = this.cartService.items$.pipe(
      map(items => items.length)
    );

    // On client side, check auth status after render
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this._isLoggedIn = !!this.authService.getToken();
        this.cdr.detectChanges();
      });
    }
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
