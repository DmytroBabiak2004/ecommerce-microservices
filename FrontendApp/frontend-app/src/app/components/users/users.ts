import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users';
import { AuthResponse, LoginModel, RegisterModel } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  registerModel: RegisterModel = { firstName: '', lastName: '', email: '', password: '' };
  loginModel: LoginModel = { email: '', password: '' };
  authResponse: AuthResponse | null = null;
  profile: any | null = null;
  isLoggedIn: boolean = false;
  message: string = '';

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    // In a real application, you would check for a token in localStorage or a cookie
    // For this example, we'll just assume if authResponse is set, user is logged in.
    this.isLoggedIn = !!this.authResponse;
    if (this.isLoggedIn) {
      this.getProfile();
    }
  }

  onRegister(): void {
    this.usersService.register(this.registerModel).subscribe({
      next: (response) => {
        this.authResponse = response;
        this.isLoggedIn = true;
        this.message = 'Registration successful!';
        this.getProfile();
      },
      error: (err) => {
        this.message = 'Registration failed: ' + (err.error.message || JSON.stringify(err.error));
        console.error('Registration error', err);
      }
    });
  }

  onLogin(): void {
    this.usersService.login(this.loginModel).subscribe({
      next: (response) => {
        this.authResponse = response;
        this.isLoggedIn = true;
        this.message = 'Login successful!';
        this.getProfile();
      },
      error: (err) => {
        this.message = 'Login failed: ' + (err.error.message || JSON.stringify(err.error));
        console.error('Login error', err);
      }
    });
  }

  getProfile(): void {
    this.usersService.getProfile().subscribe({
      next: (response) => {
        this.profile = response;
      },
      error: (err) => {
        this.message = 'Failed to fetch profile: ' + (err.error.message || JSON.stringify(err.error));
        console.error('Profile fetch error', err);
        this.isLoggedIn = false; // Log out if profile fetch fails
        this.authResponse = null;
      }
    });
  }

  onLogout(): void {
    this.authResponse = null;
    this.profile = null;
    this.isLoggedIn = false;
    this.message = 'Logged out successfully.';
  }
}