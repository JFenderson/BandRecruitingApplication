import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { CreateUserDTO } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Band {
  bandId: string;
  name: string;
}

@Component({
  selector: 'app-recruiter-form',
  templateUrl: './recruiter-form.component.html',
   standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class RecruiterFormComponent implements OnInit {
  form: FormGroup;
  bands: Band[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      userType: ['Recruiter'],
      bandId: ['', Validators.required],
      profilePicture: ['']
    });
  }

  ngOnInit(): void {
    this.http.get<Band[]>(`${environment.apiUrl}/bands`).subscribe({
      next: (data) => (this.bands = data),
      error: (err) => console.error('Failed to load bands', err)
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
        this.success = 'Recruiter created!';
        this.error = '';
        this.form.reset();
        this.imagePreview = null;
      },
      error: (err) => {
        this.error = 'Failed to create recruiter.';
        this.success = '';
        console.error(err);
      }
    });
  }
}
