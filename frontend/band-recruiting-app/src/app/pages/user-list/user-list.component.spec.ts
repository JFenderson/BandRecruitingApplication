import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent }       from './user-list.component';
import { UserService }             from '../../core/services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of }                      from 'rxjs';
import { UserDTO }                 from '../../core/models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const fakeUsers: UserDTO[] = [{
    id: '1',
    email: 'a@a.com',
    password: 'p',
    userType: 'Student',
    firstName: 'F',
    lastName: 'L',
    phone: '123',
    offerCount: 0,
    createdAt: '2025-01-01T00:00:00Z'
  }];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAll']);
    userServiceSpy.getAll.and.returnValue(of(fakeUsers));

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,        // standalone component
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();    // runs ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAll and populate users', () => {
    expect(userServiceSpy.getAll).toHaveBeenCalled();
    expect(component.users).toEqual(fakeUsers);
  });
});
