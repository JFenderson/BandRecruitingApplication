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
    userServiceSpy.create.and.returnValue(of({
      id: '1',
      email: 'x@y.com',
      password: 'pass',
      userType: 'Student',
      offerCount: 0,
      createdAt: '',
      updatedAt: ''
    }));

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
      userName:  'XYStudent'
    };

    component.userForm.setValue({
      ...formValue,
      // nested role groups exist but are disabled by default
      student: { instrument: '', highSchool: '' },
      recruiter: { organization: '', title: '' },
      admin: {}
    } as any);

    component.onSubmit();

    expect(userServiceSpy.create).toHaveBeenCalledWith(formValue);
  });
});
