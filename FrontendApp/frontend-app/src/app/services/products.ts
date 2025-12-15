import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }
}