import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StudentDashboardComponent } from './student-dashboard.component';
import { StudentService } from '../../core/services/student.service';

describe('StudentDashboardComponent', () => {
  let fixture: ComponentFixture<StudentDashboardComponent>;
  let component: StudentDashboardComponent;
  let studentServiceSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    studentServiceSpy = jasmine.createSpyObj('StudentService', [
      'getDashboardSummary',
      'getCurrentStudent',
      'getStudents'
    ]);

    studentServiceSpy.getDashboardSummary.and.returnValue(of({
      totalStudents: 0, totalOffers: 0, totalVideos: 0
    }));
    studentServiceSpy.getCurrentStudent.and.returnValue(of(null));
    studentServiceSpy.getStudents.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [StudentDashboardComponent],
      providers: [
        { provide: StudentService, useValue: studentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
