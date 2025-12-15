import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginModel } from '../models/models';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private readonly TOKEN_NAME = 'authToken';

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._isLoggedIn$.next(!!this.getToken());
    }
  }

  login(credentials: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/users/login', credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this._isLoggedIn$.next(false);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_NAME);
    }
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_NAME, token);
    }
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_NAME);
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      // Try multiple possible claim names
      return decodedToken.nameid || 
             decodedToken.sub || 
             decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
             null;
    }
    return null;
  }

  checkAuthStatus(): void {
    // Check if token exists and update login state
    if (isPlatformBrowser(this.platformId)) {
      const hasToken = !!this.getToken();
      this._isLoggedIn$.next(hasToken);
    }
  }
}
