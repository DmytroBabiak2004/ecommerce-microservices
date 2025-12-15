import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginModel, RegisterModel } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  register(model: RegisterModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, model);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }
}