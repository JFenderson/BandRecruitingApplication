import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }        from '@angular/forms';
import { RegisterComponent }          from './register.component';
import { HttpClientTestingModule }    from '@angular/common/http/testing';
import { RouterTestingModule }        from '@angular/router/testing';
import { AuthService }                from '../../core/services/auth.service';
import { of }                         from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    authSpy.register.and.returnValue(of({ token: 'abc' }));

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call AuthService.register on submit', () => {
    component.registerForm.setValue({ email: 'u', password: 'p' });
    component.onSubmit();
    expect(authSpy.register).toHaveBeenCalledWith({ email: 'u', password: 'p' });
  });
});
