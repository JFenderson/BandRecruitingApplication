import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService, private authService: AuthService, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    let cloned = req;
    if (token) {
      cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(cloned).pipe(
      catchError(err => {
        if (err.status === 401 && !req.url.endsWith('/login') && !req.url.endsWith('/refresh-token')) {
         
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.tokenService.getToken();
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next.handle(retryReq);
            }),
            catchError(refreshErr => {
                this.toastr.warning('Session expired. Please log in again.', 'Logged Out');
                alert('Your session has expired. Please log in again.');
              console.error('Refresh failed', refreshErr);
              this.authService.logout();
              return throwError(() => refreshErr);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
