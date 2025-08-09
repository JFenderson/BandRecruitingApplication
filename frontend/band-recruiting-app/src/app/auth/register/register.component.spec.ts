import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    authSpy.register.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call AuthService.register on submit', () => {
    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',     // valid email
      password: 'password123',       // non-empty
      confirmPassword: 'password123' // if your form has this
    } as any);

    component.onSubmit();
    expect(authSpy.register).toHaveBeenCalled();
  });
});
