import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/Account`;

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) {}

login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/login`, credentials);
}


  register(data: any) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/register`, data).pipe(
      tap(res => this.tokenService.setToken(res.token))
    );
  }

  logout() {
    this.tokenService.clearAllTokens();
    this.router.navigate(['/login']);
  }

  refreshToken() {
  const accessToken = this.tokenService.getToken();
  const refreshToken = this.tokenService.getRefreshToken();

  return this.http.post<any>(`${this.baseUrl}/refresh-token`, {
    accessToken,
    refreshToken
  }).pipe(
    tap(res => {
      this.tokenService.setToken(res.token);
      this.tokenService.setRefreshToken(res.refreshToken);
    })
  );
}
}
