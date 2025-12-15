import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow navigation (client will handle actual auth check)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // On client side, check if token exists
  const token = authService.getToken();
  
  if (token) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
