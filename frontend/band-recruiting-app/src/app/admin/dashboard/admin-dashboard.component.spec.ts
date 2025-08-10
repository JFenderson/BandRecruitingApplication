// src/app/admin/dashboard/admin-dashboard.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { UserDTO } from '../../core/models/user.model';


describe('AdminDashboardComponent', () => {
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let component: AdminDashboardComponent;
  let dashSpy: jasmine.SpyObj<DashboardService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let userSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    dashSpy = jasmine.createSpyObj('DashboardService', ['getDashboardSummary']);
    dashSpy.getDashboardSummary.and.returnValue(of({
      totalStudents: 1,
      totalRecruiters: 0,
      totalOffers: 2
    }));

    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    const routeStub = {
      snapshot: { paramMap: convertToParamMap({}) },
      paramMap: of(convertToParamMap({})),
      data: of({})
    };

const mockUsers: UserDTO[] = [
  {
    id: 'u1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'a@b.com',
    userType: 'Student',
    phone: '1234567890',
    password: '',                 // OK to be empty for tests
    createdAt: ''         // or new Date().toISOString() if your model uses string
  }
];

    // IMPORTANT: include getAll (component calls this)
    userSpy = jasmine.createSpyObj('UserService', ['getAll', 'getUsers', 'getRecruiters', 'getStudents', 'getById']);
  userSpy.getAll.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: dashSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: UserService, useValue: userSpy },
        { provide: ActivatedRoute, useValue: routeStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call DashboardService.getDashboardSummary and populate totals', () => {
    expect(dashSpy.getDashboardSummary).toHaveBeenCalled();
    expect(userSpy.getAll).toHaveBeenCalled(); // optional verification
    expect(component.totalStudents).toBe(1);
    expect(component.totalOffers).toBe(2);
  });
});
