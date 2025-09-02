import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  nameid: string;
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearAllTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }

  getRoles(): string[] {
    const payload = this.decodeToken();
    if (!payload) return [];

    // Handle .NET role claims
    const roleFromClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const roleFromStandard = payload.role;

    const role = roleFromClaim || roleFromStandard;

    if (typeof role === 'string') return [role];
    if (Array.isArray(role)) return role;
    return [];
  }

  getUserId(): string | null {
    const payload = this.decodeToken();
    return payload?.nameid || payload?.sub || null;
  }

  isAdmin(): boolean {
    return this.getRoles().includes('Admin');
  }

  isRecruiter(): boolean {
    return this.getRoles().includes('Recruiter');
  }

  isStudent(): boolean {
    return this.getRoles().includes('Student');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken();
    if (!payload) return false;

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  logout(): void {
    this.clearAllTokens();
    this.router.navigate(['/login']);
  }
}