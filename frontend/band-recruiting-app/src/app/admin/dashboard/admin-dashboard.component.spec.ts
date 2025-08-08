import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent }   from './admin-dashboard.component';
import { UserService }              from '../../core/services/user.service';
import { DashboardService }         from '../../core/services/dashboard.service';
import { of }                       from 'rxjs';
import { provideHttpClientTesting }  from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('AdminDashboardComponent', () => {
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let component: AdminDashboardComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let dashboardSpy: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    // create spies for both services
    userServiceSpy    = jasmine.createSpyObj('UserService', ['getAll']);
    dashboardSpy      = jasmine.createSpyObj('DashboardService', ['getDashboardSummary']);

    // stub getAll() so users load without error
    userServiceSpy.getAll.and.returnValue(of([]));

    // stub getDashboardSummary() with realistic totals
    dashboardSpy.getDashboardSummary.and.returnValue(of({
      totalStudents: 42,
      totalRecruiters: 7,
      totalOffers: 13
    }));

    await TestBed.configureTestingModule({
      imports: [
        AdminDashboardComponent,      // standalone component
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: UserService,      useValue: userServiceSpy },
        { provide: DashboardService, useValue: dashboardSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call DashboardService.getDashboardSummary and populate totals', () => {
    expect(dashboardSpy.getDashboardSummary).toHaveBeenCalled();
    expect(component.totalStudents).toBe(42);
    expect(component.totalRecruiters).toBe(7);
    expect(component.totalOffers).toBe(13);
  });
});
