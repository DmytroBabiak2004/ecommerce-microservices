import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { OrderResponse, OrderRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = '/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getOrders(): Observable<OrderResponse[]> {
    const userId = this.authService.getUserId();
    if (userId) {
      return this.getOrdersByUserId(userId);
    }
    return new Observable<OrderResponse[]>(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getOrdersByUserId(userId: string): Observable<OrderResponse[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderRequest);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}