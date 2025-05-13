import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

 canActivate(route: ActivatedRouteSnapshot): boolean {
  const role = this.tokenService.getRole();

  if (route.data['roles'] && !route.data['roles'].includes(role)) {
    this.router.navigate(['/unauthorized']);
    return false;
  }

  return true;
}

}
