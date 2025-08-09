import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { UserCreateComponent } from './user-create.component';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

describe('UserCreateComponent', () => {
  let fixture: ComponentFixture<UserCreateComponent>;
  let component: UserCreateComponent;
  let userServiceSpy: jasmine.SpyObj<any>;
  let toastSpy: jasmine.SpyObj<any>;

  const BASE_FORM_VALUE = {
    email:     'x@y.com',
    password:  'pass123',
    userType:  'Student' as const,
    firstName: 'X',
    lastName:  'Y',
    phone:     '1234567890'
  };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['create']);
    // do NOT reference BASE_FORM_VALUE here; just return something static or echo the arg
    userServiceSpy.create.and.callFake((payload: any) => of({ id: '1', ...payload }));

    toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [UserCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastrService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call UserService.create with the base form value', () => {
    component.userForm.setValue({
      ...BASE_FORM_VALUE,
      student:  { instrument: '', highSchool: '' },
      recruiter:{ bandId: '' },
      admin:    {}
    } as any);

    component.onSubmit();
    expect(userServiceSpy.create).toHaveBeenCalledWith(BASE_FORM_VALUE);
  });
});
