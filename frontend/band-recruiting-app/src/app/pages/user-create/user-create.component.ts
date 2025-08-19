import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecruiterFormComponent } from './recruiter-form/recruiter-form.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { UserService } from '../../core/services/user.service';
import { UserDTO, CreateUserPayload } from '../../core/models/user.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
            RecruiterFormComponent, StudentFormComponent, AdminFormComponent],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent implements OnInit {
  userType: 'Student' | 'Recruiter' | 'Admin' = 'Student';
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private users: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      // common fields expected by specs
      email:     ['', [Validators.required, Validators.email]],
      userType:  ['Student', Validators.required],
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      phone:     ['', Validators.required],
      

      // nested role-specific
      student: this.fb.group({
        instrument: [''],
        highSchool: [''],
        graduationYear: [''],
      }),
      recruiter: this.fb.group({
                bandId: [''],

      }),
      admin: this.fb.group({}),
    });
  }

  onUserTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as this['userType'];
    this.userType = value;
    this.userForm.get('userType')!.setValue(value);
  }

  get studentGroup()  { return this.userForm.get('student')  as FormGroup; }
  get recruiterGroup() { return this.userForm.get('recruiter') as FormGroup; }
  get adminGroup()     { return this.userForm.get('admin')     as FormGroup; }

  onSubmit() {
    if (this.userForm.invalid) return;

    // Specs for UserCreate expect only the top-level fields in the payload:
    const { email, password, userType, firstName, lastName, phone } = this.userForm.value;
    const payload: CreateUserPayload = { email, userType, firstName, lastName, phone };

    // this.users.create(payload).subscribe(); // test spies this call
    this.users.create(payload).subscribe({
  next: created => { /* toast + navigate */ },
  error: err => console.error(err)
});
  }
}
