import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<any>;

const fakeJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + // header
  btoa(JSON.stringify({
    sub: '1',
    email: 'u@example.com',
    role: 'Student',
    exp: Math.floor(Date.now()/1000) + 3600
  })) +
  '.sig';

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
  authSpy.login.and.returnValue(of({ token: fakeJwt }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({}) },
            queryParamMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call AuthService.login on submit', () => {
    component.loginForm.setValue({ email: 'u@example.com', password: 'password123' });
    component.onSubmit();
    expect(authSpy.login).toHaveBeenCalledWith({ email: 'u@example.com', password: 'password123' });
  });
});
