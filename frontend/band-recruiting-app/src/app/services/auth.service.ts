import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  register(data: { email: string; password: string; role: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
