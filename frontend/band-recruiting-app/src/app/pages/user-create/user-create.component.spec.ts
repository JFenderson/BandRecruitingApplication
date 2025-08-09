import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { UserCreateComponent } from './user-create.component';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['create']);

    // Provide a valid default response (no dependency on test-scoped variables)
    userServiceSpy.create.and.returnValue(
      of({
        id: 'resp-1',
        email: 'admin@example.com',
        password: 'x',
        userType: 'Admin',
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '205-000-0000',
        createdAt: '',
        student: null,
        recruiter: null,
      } as any)
    );

    toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [UserCreateComponent, ReactiveFormsModule],
      providers: [
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastrService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call UserService.create with the form value', () => {
    const formValue = {
      email:     'x@y.com',
      password:  'pass123',
      userType:  'Student' as const,
      firstName: 'X',
      lastName:  'Y',
      phone:     '1234567890',
      userName:  'XYStudent',
    };

    // Provide values for nested groups (present but typically disabled initially)
    component.userForm.setValue({
      ...formValue,
      student:   { instrument: '', highSchool: '', graduationYear: null },
      recruiter: { bandId: '' },
      admin:     {},
    } as any);

    component.onSubmit();

    // Allow extra properties if your submit uses getRawValue()
    expect(userServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining(formValue));
  });
});
