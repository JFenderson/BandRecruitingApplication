import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminUserService, UserDTO, UpdateUserDTO } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user.component.html',
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class AdminUserProfileComponent implements OnInit {
  form!: FormGroup;
  userId!: string;
  user!: UserDTO;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminUserService: AdminUserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.adminUserService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      this.buildForm(user);
    });
  }

  buildForm(user: UserDTO) {
    this.form = this.fb.group({
      email: [user.email],
      password: [''],
      firstName: [user.firstName],
      lastName: [user.lastName],
      phone: [user.phone],
      instrument: [user.instrument],
      highSchool: [user.highSchool],
      graduationYear: [user.graduationYear],
      bandId: [user.bandId],
    });
  }

  onSubmit() {
    const update: UpdateUserDTO = this.form.value;
    this.adminUserService.updateUser(this.userId, update).subscribe({
      next: () => alert('User updated successfully'),
      error: (err) => console.error('Failed to update user', err),
    });
  }
}
