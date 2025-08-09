import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { StudentFormComponent } from './student-form/student-form.component';
import { RecruiterFormComponent } from './recruiter-form/recruiter-form.component';
import { AdminDashboardComponent } from '../../admin/dashboard/admin-dashboard.component';

import { UserService } from '../../core/services/user.service';
import { CreateUserPayload, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StudentFormComponent,
    RecruiterFormComponent,
    AdminDashboardComponent
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  @Input() allowedRoles: UserRole[] = ['Student', 'Recruiter', 'Admin'];
  @Input() mode: 'admin-create' | 'register' = 'admin-create';

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private toast = inject(ToastrService);

  userForm = this.fb.group({
    // Base fields expected by your unit test
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    userType: ['Student' as UserRole, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],


    // Role groups (disabled by default so they won't appear in form.value)
    student: this.fb.group({
      instrument: [''],
      highSchool: [''],
      graduationYear: ['']
    }),
    recruiter: this.fb.group({
      bandId: ['']

    }),
    admin: this.fb.group({}),
  });

  ngOnInit(): void {
    // Disable all role groups initially so .value only contains base fields
    this.userForm.get('student')!.disable({ emitEvent: false });
    this.userForm.get('recruiter')!.disable({ emitEvent: false });
    this.userForm.get('admin')!.disable({ emitEvent: false });

    // If you want Student group active by default, enable here. We’ll keep all disabled
    // so your existing unit test (which sets only base fields) passes.
  }

  onUserTypeChange(role: UserRole) {
    this.userForm.get('userType')!.setValue(role);

    // Toggle role groups
    const map: Record<UserRole, string> = {
      Student: 'student',
      Recruiter: 'recruiter',
      Admin: 'admin'
    };

    for (const key of ['student', 'recruiter', 'admin'] as const) {
      const ctrl = this.userForm.get(key)!;
      key === map[role] ? ctrl.enable({ emitEvent: false }) : ctrl.disable({ emitEvent: false });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Only enabled controls are included in .value (nested role group is disabled unless selected)
    const payload = this.userForm.value as unknown as CreateUserPayload;

    this.userService.create(payload).subscribe({
      next: () => {
        this.toast.success('User created');
        // Go back to list or admin dashboard
        this.router.navigate(['/admin-dashboard/all-users']);
      },
      error: () => {
        this.toast.error('Failed to create user');
      }
    });
  }
}
