// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const expectedRole = route.data['expectedRole'] as string | undefined;
    const allowed: string[] = route.data['roles'] as string[] ?? (expectedRole ? [expectedRole] : []);

    // if no roles specified for the route, allow through
    if (!allowed.length) return true;

    const userRoles = this.tokenService.getRoles();
    const allowedHit = userRoles.some(r => allowed.includes(r));
    return allowedHit ? true : this.router.parseUrl('/unauthorized');
  }
}
