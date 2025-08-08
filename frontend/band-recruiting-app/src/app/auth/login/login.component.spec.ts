import { ComponentFixture, TestBed }    from '@angular/core/testing';
import { LoginComponent }               from './login.component';
import { HttpClientTestingModule }      from '@angular/common/http/testing';
import { RouterTestingModule }          from '@angular/router/testing';
import { ReactiveFormsModule }          from '@angular/forms';
import { AuthService }                  from '../../core/services/auth.service';
import { of }                           from 'rxjs';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,                     // standalone component
        HttpClientTestingModule,            // provides HttpClient
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,                // for FormGroup/FormBuilder
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login on submit', () => {
    // arrange
    authSpy.login.and.returnValue(of({ token: 'xyz' }));
    component.loginForm.setValue({ username: 'u', password: 'p' });

    // act
    component.onSubmit();

    // assert
    expect(authSpy.login).toHaveBeenCalledWith({ email: 'u', password: 'p' });
  });
});
