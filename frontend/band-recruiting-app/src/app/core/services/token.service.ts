import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  nameid: string;
  name: string;
  UserType: string;
  role: string | string[];
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private roleKey = 'role'; // optional if using only JWT

  constructor(private router: Router) {}

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Clear token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Decode token
  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Failed to decode JWT', error);
      return null;
    }
  }

  // Extract role (first if array)
 getRole(): string | null {
  const decoded = this.decodeToken();
  if (!decoded) return null;

  return (
    (decoded as any)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null
  );
}
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isRecruiter(): boolean {
    return this.getRole() === 'Recruiter';
  }

  isStudent(): boolean {
    return this.getRole() === 'Student';
  }

  getUserType(): string | null {
    return this.decodeToken()?.UserType ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
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
}
