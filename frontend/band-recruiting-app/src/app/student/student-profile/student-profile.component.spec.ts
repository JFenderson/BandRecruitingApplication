import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute }             from '@angular/router';
import { HttpClientTestingModule }    from '@angular/common/http/testing';
import { StudentProfileComponent }    from './student-profile.component';
import { StudentService }             from '../../core/services/student.service';
import { of }                         from 'rxjs';
import { StudentDTO }                 from '../../core/models/student.model';

describe('StudentProfileComponent', () => {
  let component: StudentProfileComponent;
  let fixture: ComponentFixture<StudentProfileComponent>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  // A complete StudentDTO per your model
  const fakeStudent: StudentDTO = {
    studentId:    '7',
    firstName:    'Stu',
    lastName:     'Dent',
    email:        's@school.com',
    phone:        '000',
    instrument:   'Piano',
    highSchool:   'Central HS',
    profilePicture: null,
    // videoUrl is optional, so we can omit it
  };

  beforeEach(async () => {
    studentServiceSpy = jasmine.createSpyObj(
      'StudentService',
      ['getStudentById']
    );
    studentServiceSpy.getStudentById.and.returnValue(of(fakeStudent));

    await TestBed.configureTestingModule({
      imports: [
        StudentProfileComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: StudentService, useValue: studentServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '7' } } }
        }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(StudentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

it('should load student on init', () => {
  // service must be called with the raw route value (still a string, since getStudentById expects a string)
  expect(studentServiceSpy.getStudentById).toHaveBeenCalledWith('7');

  // now compare the component.student object against the fakeStudent DTO
  expect(component.student).toEqual(fakeStudent);

  // and (optionally) assert the parsed ID separately
  expect(component.studentId).toEqual("7");
});
});
