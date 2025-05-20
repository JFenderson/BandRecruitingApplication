import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecruiterFormComponent } from './recruiter-form/recruiter-form.component';
import { StudentFormComponent } from './student-form/student-form.component';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
   standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, RecruiterFormComponent, StudentFormComponent],
})
export class UserCreateComponent {
  userType: 'Student' | 'Recruiter' = 'Student';

  onUserTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.userType = value as 'Student' | 'Recruiter';
  }
}
