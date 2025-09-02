import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CreateUserDTO } from '../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;
  bands: any[] = [];
  instruments = [
    'Flute', 'Clarinet', 'Saxophone', 'Trumpet', 'Trombone', 
    'French Horn', 'Tuba', 'Percussion', 'Snare Drum', 
    'Tenor Drum', 'Bass Drum', 'Cymbals', 'Baritone', 
    'Sousaphone', 'Color Guard', 'Dance', 'Drum Major'
  ];
  isLoading = false;

  get userType() { 
    return this.userForm?.get('userType')?.value; 
  }

 constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private toastr: ToastrService,
    public router: Router, 
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['Student', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      
      // Student fields
      instrument: [''],
      highSchool: [''],
      graduationYear: [''],
      
      // Recruiter fields
      bandId: ['']
    });

    // Update validators based on user type
    this.userForm.get('userType')?.valueChanges.subscribe(userType => {
      this.updateConditionalValidators(userType);
    });

    this.loadBands();
  }

  private updateConditionalValidators(userType: string) {
    const instrumentControl = this.userForm.get('instrument');
    const highSchoolControl = this.userForm.get('highSchool');
    const graduationYearControl = this.userForm.get('graduationYear');
    const bandIdControl = this.userForm.get('bandId');

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
    this.http.get<any[]>(`${environment.apiUrl}/bands`).subscribe({
      next: bands => this.bands = bands,
      error: err => console.error('Failed to load bands', err)
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.userForm.value;

    const payload: CreateUserDTO = {
      email: formValue.email,
      password: formValue.password,
      userType: formValue.userType,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone
    };

    // Add role-specific fields
    if (formValue.userType === 'Student') {
      payload.instrument = formValue.instrument;
      payload.highSchool = formValue.highSchool;
      payload.graduationYear = parseInt(formValue.graduationYear);
    } else if (formValue.userType === 'Recruiter') {
      payload.bandId = formValue.bandId;
    }

    this.userService.create(payload).subscribe({
      next: (user) => {
        this.toastr.success('User created successfully');
        this.router.navigate(['/admin-dashboard']);
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to create user');
        console.error('Failed to create user:', err);
        this.isLoading = false;
      }
    });
  }
}