import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { TokenService } from '../services/token.service';

describe('AuthGuard (class)', () => {
  let guard: AuthGuard;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getToken']);
    const routSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router,       useValue: routSpy }
      ]
    });
    guard           = TestBed.inject(AuthGuard);
    tokenServiceSpy = TestBed.inject(TokenService) as any;
    routerSpy       = TestBed.inject(Router)       as any;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('denies access and redirects when no token', () => {
    tokenServiceSpy.getToken.and.returnValue(null);
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('allows access when token present', () => {
    tokenServiceSpy.getToken.and.returnValue('abc');
    expect(guard.canActivate()).toBeTrue();
  });
});
