import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

type AnyPayload = Record<string, unknown>;

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

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }

clearToken(): void {
localStorage.removeItem(this.tokenKey);
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

private decode(): AnyPayload | null {
const t = this.getToken();
if (!t) return null;
try {
return jwtDecode<AnyPayload>(t);
} catch {
return null;
}
}

private rolesFrom(payload: AnyPayload | null): string[] {
if (!payload) return [];
const candidates = [
payload['role'],
payload['roles'],
payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/roles']
];


const flat: string[] = [];
for (const c of candidates) {
  if (typeof c === 'string' && c.trim()) flat.push(c);
  if (Array.isArray(c)) for (const v of c) if (typeof v === 'string') flat.push(v);
}
return [...new Set(flat)];
}

getUserType(): string | null {
const p = this.decode();
const ut = p?.['UserType'];
return typeof ut === 'string' ? ut : null;
}

getRoles(): string[] {
return this.rolesFrom(this.decode());
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
return !!this.getToken();
}

logout(): void {
localStorage.clear();
this.router.navigate(['/login']);
}
}