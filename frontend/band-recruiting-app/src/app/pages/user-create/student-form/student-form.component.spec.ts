import { ComponentFixture, TestBed }    from '@angular/core/testing';
import { ReactiveFormsModule }           from '@angular/forms';
import { StudentFormComponent }          from './student-form.component';
import { StudentService }                from '../../../core/services/student.service';
import { HttpClientTestingModule }       from '@angular/common/http/testing';
import { of }                            from 'rxjs';
import { StudentDTO }                    from '../../../core/models/student.model';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;

  // A fake StudentDTO matching your model
  const fakeStudent: StudentDTO = {
    studentId:  '1',
    firstName:  'A',
    lastName:   'B',
    email:      'a@b.com',
    phone:      '123',
    instrument: 'Guitar',
    highSchool: 'HS',
    profilePicture: null,
  };

  beforeEach(async () => {
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['createStudent']);
    // return an Observable<StudentDTO>, not { success: boolean }
    studentServiceSpy.createStudent.and.returnValue(of(fakeStudent));

    await TestBed.configureTestingModule({
      imports: [
        StudentFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: StudentService, useValue: studentServiceSpy }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call createStudent on submit', () => {
    // Fill the form with exactly the shape your component expects
    const formValue = {
      firstName:  'A',
      lastName:   'B',
      email:      'a@b.com',
      phone:      '123',
      instrument: 'Guitar',
      highSchool: 'HS'
    };
    component.form.setValue(formValue);

    component.submit();  // uses your real `submit()` method

    expect(studentServiceSpy.createStudent).toHaveBeenCalledWith(formValue);
  });
});
