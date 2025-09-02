import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { UserDTO, UpdateUserDTO } from '../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-user-profile.component.html',
  styleUrls: ['./admin-user-profile.component.scss']
})
export class AdminUserProfileComponent implements OnInit {
  form!: FormGroup;
  userId!: string;
  user!: UserDTO;
  isLoading = true;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getById(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.buildForm(user);
        this.isLoading = false;
      },
      error: err => {
        this.toastr.error('Failed to load user profile');
        this.isLoading = false;
        console.error('Failed to load user:', err);
      }
    });
  }

  private buildForm(user: UserDTO): void {
    this.form = this.fb.group({
      email: [user.email, [Validators.required, Validators.email]],
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      phone: [user.phone, Validators.required],

      // Student fields
      instrument: [user.instrument || ''],
      highSchool: [user.highSchool || ''],
      graduationYear: [user.graduationYear || ''],

      // Recruiter field
      bandId: [user.bandId || '']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updateData: UpdateUserDTO = this.form.value;

    this.userService.update(this.userId, updateData).subscribe({
      next: () => {
        this.toastr.success('User updated successfully');
        this.user = { ...this.user, ...updateData };
        this.isSaving = false;
      },
      error: err => {
        this.toastr.error('Failed to update user');
        console.error('Update failed:', err);
        this.isSaving = false;
      }
    });
  }
}