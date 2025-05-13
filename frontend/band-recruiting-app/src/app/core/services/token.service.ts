import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  sub: string;
  nameid: string;
  name: string;
  UserType: string;
  role: string | string[];  // sometimes single, sometimes array
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  setToken(token: string): void {
    throw new Error('Method not implemented.');
  }
  clearAllTokens() {
    throw new Error('Method not implemented.');
  }
  getRefreshToken() {
    throw new Error('Method not implemented.');
  }
  setRefreshToken(refreshToken: any) {
    throw new Error('Method not implemented.');
  }
  private tokenKey = 'access_token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

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

getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;
  } catch {
    return null;
  }
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

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
