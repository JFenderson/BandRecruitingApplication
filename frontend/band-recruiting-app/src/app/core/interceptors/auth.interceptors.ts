import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const token = tokenService.getToken();
  const isLoginOrRefresh = req.url.endsWith('/login') || req.url.endsWith('/refresh-token');

  let cloned = req;
  if (!isLoginOrRefresh && token) {
    console.log('[DEBUG] Attaching token for:', req.url);
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  return next(cloned).pipe(
    catchError(err => {
      if (err.status === 401 && !req.url.endsWith('/login') && !req.url.endsWith('/refresh-token')) {
        console.log('[DEBUG] Intercepting', req.url);
        console.log('[DEBUG] Current Token', token);
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = tokenService.getToken();
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`)
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            toastr.warning('Session expired. Please log in again.', 'Logged Out');
            alert('Your session has expired. Please log in again.');
            console.error('Refresh failed', refreshErr);
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
