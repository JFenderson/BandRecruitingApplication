import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>, 
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  
  // Skip token for auth endpoints
  const isAuthEndpoint = req.url.includes('/login') || 
                        req.url.includes('/register') || 
                        req.url.includes('/refresh-token');
  
  let clonedRequest = req;
  
  // Add token to non-auth requests
  if (!isAuthEndpoint) {
    const token = tokenService.getToken();
    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(clonedRequest).pipe(
    catchError(error => {
      // Handle 401 errors (token expired)
      if (error.status === 401 && !isAuthEndpoint && tokenService.getRefreshToken()) {
        // Attempt to refresh token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request with new token
            const newToken = tokenService.getToken();
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryRequest);
          }),
          catchError(refreshError => {
            // Refresh failed, logout user
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      
      return throwError(() => error);
    })
  );
};