import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';

describe('AdminDashboardComponent', () => {
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let component: AdminDashboardComponent;
  let dashSpy: jasmine.SpyObj<any>;
  let toastrSpy: jasmine.SpyObj<any>;
  let userSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    dashSpy = jasmine.createSpyObj('DashboardService', ['getDashboardSummary']);
    dashSpy.getDashboardSummary.and.returnValue(of({ totalStudents: 1, totalOffers: 2, totalVideos: 3 }));

    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    // Mock UserService so DI doesn't try to build ApiService/HttpClient
    userSpy = jasmine.createSpyObj('UserService', ['getUsers', 'getRecruiters', 'getStudents', 'getById']);
    userSpy.getUsers.and.returnValue(of([]));
    userSpy.getRecruiters.and.returnValue(of([]));
    userSpy.getStudents.and.returnValue(of([]));
    userSpy.getById.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: dashSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: UserService, useValue: userSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call DashboardService.getDashboardSummary and populate totals', () => {
    expect(dashSpy.getDashboardSummary).toHaveBeenCalled();
    expect(component.totalStudents).toBe(1);
    expect(component.totalOffers).toBe(2);
  });
});
