import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CreateUserDTO } from '../../core/models/user.model';

// Custom validator for password matching
function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  bands: { bandId: string; name: string }[] = [];
  instruments: string[] = [  // Changed to simple string array
    'Flute', 'Clarinet', 'Saxophone', 'Trumpet', 'Trombone', 
    'French Horn', 'Tuba', 'Percussion', 'Snare Drum', 
    'Tenor Drum', 'Bass Drum', 'Cymbals', 'Baritone', 
    'Sousaphone', 'Color Guard', 'Dance', 'Drum Major'
  ];
  isLoading = false;
  errorMessage = '';

  get roleValue() {
    return this.registerForm.get('userType')?.value;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      userType: ['Student', Validators.required],
      
      // Conditional fields
      instrument: [''],
      highSchool: [''],
      graduationYear: [''],
      bandId: ['']
    }, { validators: passwordMatchValidator });

    // Add conditional validators based on user type
    this.registerForm.get('userType')?.valueChanges.subscribe(userType => {
      this.updateConditionalValidators(userType);
    });

    this.loadBands();
  }

  private updateConditionalValidators(userType: string) {
    const instrumentControl = this.registerForm.get('instrument');
    const highSchoolControl = this.registerForm.get('highSchool');
    const graduationYearControl = this.registerForm.get('graduationYear');
    const bandIdControl = this.registerForm.get('bandId');

    // Clear existing validators
    instrumentControl?.clearValidators();
    highSchoolControl?.clearValidators();
    graduationYearControl?.clearValidators();
    bandIdControl?.clearValidators();

    if (userType === 'Student') {
      instrumentControl?.setValidators(Validators.required);
      highSchoolControl?.setValidators(Validators.required);
      graduationYearControl?.setValidators(Validators.required);
    } else if (userType === 'Recruiter') {
      bandIdControl?.setValidators(Validators.required);
    }

    // Update validity
    instrumentControl?.updateValueAndValidity();
    highSchoolControl?.updateValueAndValidity();
    graduationYearControl?.updateValueAndValidity();
    bandIdControl?.updateValueAndValidity();
  }

  loadBands() {
    this.http.get<any[]>(`${environment.apiUrl}/bands`)
      .subscribe({
        next: res => this.bands = res,
        error: err => console.error('Failed to load bands', err)
      });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.registerForm.value;
    const payload: CreateUserDTO = {
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    };

    // Add conditional fields
    if (formData.userType === 'Student') {
      payload.instrument = formData.instrument;
      payload.highSchool = formData.highSchool;
      payload.graduationYear = parseInt(formData.graduationYear);
    } else if (formData.userType === 'Recruiter') {
      payload.bandId = formData.bandId;
    }

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/login'], { 
          queryParams: { message: 'Registration successful! Please log in.' }
        });
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration failed:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}