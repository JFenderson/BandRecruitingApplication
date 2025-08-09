import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    authSpy.login.and.returnValue(of({ token: 't' }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call AuthService.login on submit', () => {
    component.loginForm.setValue({
      email: 'u@example.com',   // valid
      password: 'password123'   // non-empty
    });

    component.onSubmit();
    expect(authSpy.login).toHaveBeenCalledWith({ email: 'u@example.com', password: 'password123' });
  });
});
