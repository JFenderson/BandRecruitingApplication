import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CreateUserDTO } from '../../../core/models/user.model';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  standalone: false
})
export class StudentFormComponent {
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  success = '';
  error = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      userType: ['Student'],
      instrument: ['', Validators.required],
      highSchool: [''],
      graduationYear: [''],
      profilePicture: ['']
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.form.patchValue({ profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) return;

    const user: CreateUserDTO = this.form.value;

    this.userService.create(user).subscribe({
      next: () => {
        this.success = 'Student created!';
        this.error = '';
        this.form.reset();
        this.imagePreview = null;
      },
      error: (err) => {
        this.error = 'Failed to create student.';
        this.success = '';
        console.error(err);
      }
    });
  }
}
