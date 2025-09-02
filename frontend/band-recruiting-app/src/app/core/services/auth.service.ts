import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  role: string;
  refreshToken: string;
  userId: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/account`;

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService, 
    private router: Router
  ) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  register(data: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data);
  }

  refreshToken(): Observable<{ token: string; refreshToken: string }> {
    const accessToken = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<{ token: string; refreshToken: string }>(`${this.baseUrl}/refresh-token`, {
      accessToken,
      refreshToken
    }).pipe(
      tap(res => {
        this.tokenService.setToken(res.token);
        this.tokenService.setRefreshToken(res.refreshToken);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.tokenService.clearAllTokens();
    this.router.navigate(['/login']);
  }
}