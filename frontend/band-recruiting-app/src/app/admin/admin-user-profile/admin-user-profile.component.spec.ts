// src/app/admin/user-profile/admin-user-profile.component.spec.ts
import { ComponentFixture, TestBed }        from '@angular/core/testing';
import { HttpClientTestingModule }          from '@angular/common/http/testing';
import { RouterTestingModule }              from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of }                               from 'rxjs';

import { AdminUserProfileComponent } from './admin-user-profile.component';
import { UserService }               from '../../core/services/user.service';
import { UserDTO }                   from '../../core/models/user.model';

describe('AdminUserProfileComponent', () => {
  let fixture: ComponentFixture<AdminUserProfileComponent>;
  let component: AdminUserProfileComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const fakeUser: UserDTO = {
    id:          '123',
    email:       'admin@example.com',
    password:    'secret',
    userType:    'Admin',
    offerCount:  0,
    createdAt:   '2025-01-01T00:00:00Z'
    // (all other optional props may be omitted)
  };

  beforeEach(async () => {
    // spy on the real method name, getById()
    userServiceSpy = jasmine.createSpyObj(UserService.name, ['getById']);
    userServiceSpy.getById.and.returnValue(of(fakeUser));

    await TestBed.configureTestingModule({
      imports: [
        AdminUserProfileComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: UserService,    useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '123' }) }
          }
        }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(AdminUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(userServiceSpy.getById).toHaveBeenCalledWith('123');
    expect(component.user).toEqual(fakeUser);
  });
});
