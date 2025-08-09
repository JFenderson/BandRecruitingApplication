import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { UserCreateComponent } from './user-create.component';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const FORM_VALUE = {
  email:     'ada@lovelace.com',
  password:  'pass123',
  userType:  'Student' as const,
  firstName: 'Ada',
  lastName:  'Lovelace',
  phone:     '1234567890'
};

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let toastSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['create']);
    userServiceSpy.create.and.returnValue(of({
      id: '1',
      email: FORM_VALUE.email,
      userType: 'Student',
      firstName: FORM_VALUE.firstName,
      lastName: FORM_VALUE.lastName,
      phone: FORM_VALUE.phone,
      createdAt: '',
      student: { instrument: '', highSchool: '' },
      recruiter: null
    } as any));

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

  it('should call UserService.create with the base form value', () => {
    // stay nested: role groups exist but default to disabled/empty
    component.userForm.setValue({
      ...FORM_VALUE,
      student:   { instrument: '', highSchool: '' },
      recruiter: { bandId: '' },
      admin:     {}
    } as any);

    component.onSubmit();

    expect(userServiceSpy.create).toHaveBeenCalledWith(FORM_VALUE);
  });
});
