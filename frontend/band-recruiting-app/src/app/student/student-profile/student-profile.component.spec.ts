import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StudentProfileComponent } from './student-profile.component';
import { StudentService } from '../../core/services/student.service';

describe('StudentProfileComponent', () => {
  let fixture: ComponentFixture<StudentProfileComponent>;
  let component: StudentProfileComponent;
  let studentServiceSpy: jasmine.SpyObj<any>;

  const fakeStudent = {
    studentId: '7',
    firstName: 'Stu',
    lastName: 'Dent',
    email: 's@school.com',
    phone: '000',
    instrument: 'Piano',
    highSchool: 'Central HS',
    profilePicture: null
  };

  beforeEach(async () => {
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['getStudentById']);
    studentServiceSpy.getStudentById.and.returnValue(of(fakeStudent));

    await TestBed.configureTestingModule({
      imports: [StudentProfileComponent],
      providers: [{ provide: StudentService, useValue: studentServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentProfileComponent);
    component = fixture.componentInstance;
    // if component reads ID from route, stub it there (omitted here for brevity)
    fixture.detectChanges();
  });

  it('should load student on init', () => {
    expect(studentServiceSpy.getStudentById).toHaveBeenCalled();
    expect(component.student).toEqual(fakeStudent);
  });
});
