import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

describe('AdminDashboardComponent', () => {
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let component: AdminDashboardComponent;
  let dashSpy: jasmine.SpyObj<any>;
  let toastrSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    dashSpy = jasmine.createSpyObj('DashboardService', ['getDashboardSummary']);
    dashSpy.getDashboardSummary.and.returnValue(of({
      totalStudents: 1, totalOffers: 2, totalVideos: 3
    }));

    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: dashSpy },
        { provide: ToastrService, useValue: toastrSpy }, // prevents ToastConfig DI error
      ],
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
    // adapt to your component’s field names
    expect(component.totalStudents).toBe(1);
    expect(component.totalOffers).toBe(2);
  });
});
