import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule }        from '@angular/forms';
import { UserCreateComponent }        from './user-create.component';
import { UserService }                from '../../core/services/user.service';
import { HttpClientTestingModule }    from '@angular/common/http/testing';
import { of }                         from 'rxjs';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    // Spy on the actual `create` method
    userServiceSpy = jasmine.createSpyObj('UserService', ['create']);
    // Stub its return value to an Observable of a minimal UserDTO
    userServiceSpy.create.and.returnValue(of({
      id: '1',
      email: 'x@y.com',
      password: 'pass',
      userType: 'Student',
      offerCount: 0,
      createdAt: '',
      updatedAt: ''
    }));

    await TestBed.configureTestingModule({
      imports: [
        UserCreateComponent,    // standalone component
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(UserCreateComponent);
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
    userName:  'XYStudent'      // whatever your component requires
  };

  component.userForm.setValue(formValue);

    // Call the component’s submit handler
    component.onSubmit();

    // Verify we called the correct service method with exactly those values
 expect(userServiceSpy.create).toHaveBeenCalledWith(formValue);
  });
});
