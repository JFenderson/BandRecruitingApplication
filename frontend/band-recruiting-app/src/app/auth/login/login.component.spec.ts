import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }        from '@angular/forms';
import { LoginComponent }             from './login.component';
import { HttpClientTestingModule }    from '@angular/common/http/testing';
import { RouterTestingModule }        from '@angular/router/testing';
import { AuthService }                from '../../core/services/auth.service';
import { of }                         from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    authSpy.login.and.returnValue(of({ token: 'xyz' }));

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call AuthService.login on submit', () => {
    component.loginForm.setValue({ email: 'u', password: 'p' });
    component.onSubmit();
    expect(authSpy.login).toHaveBeenCalledWith({ email: 'u', password: 'p' });
  });
});
