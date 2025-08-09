// src/app/pages/user-create/student-form/student-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentFormComponent } from './student-form.component';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;

    // Provide the required @Input() group BEFORE detectChanges.
    // Use a local variable and assign once to avoid "possibly undefined" warnings.
    const g = new FormGroup({
      instrument:     new FormControl(''),
      highSchool:     new FormControl(''),
      graduationYear: new FormControl<number | null>(null),
      bandId:         new FormControl(''),
    });

    component.group = g;          // set the input
    fixture.detectChanges();      // triggers ngOnInit -> form = group
  });

  it('should use the provided group as its form', () => {
    // After ngOnInit, `form` is always defined.
    expect(component.form).toBeTruthy();
    // When an input group is provided, form should be that exact instance.
    expect(component.form).toBe(component.group!);

    component.form.get('instrument')!.setValue('Sax');
    expect(component.form.value.instrument).toBe('Sax');
  });
});
