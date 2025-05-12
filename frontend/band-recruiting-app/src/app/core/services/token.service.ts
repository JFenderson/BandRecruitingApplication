import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  clearRefreshToken() {
    localStorage.removeItem(REFRESH_KEY);
  }

  clearAllTokens() {
    this.clearToken();
    this.clearRefreshToken();
  }
}
