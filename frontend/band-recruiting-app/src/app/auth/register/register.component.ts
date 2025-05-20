import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InstrumentService } from '../../core/services/instrument.service';
import { Instrument } from '../../core/models/instrument.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  bands: { id: string; name: string }[] = [];
instruments: Instrument[] = [];

  get roleValue() {
    return this.registerForm.get('role')?.value;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private instrumentService: InstrumentService 
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      instrument: [''],
      bandId: ['']
    });

    this.instrumentService.getAllInstruments().subscribe({
  next: (list: Instrument[]) => this.instruments = list,
  error: err => console.error('Failed to load instruments', err)
});

    this.loadBands();
  }

  loadBands() {
    this.http.get<{ id: string; name: string }[]>(`${environment.apiUrl}/bands`)
      .subscribe({
        next: res => this.bands = res,
        error: err => console.error('Failed to load bands', err)
      });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
 const formData = this.registerForm.value;
 formData.userName = formData.email;

    this.authService.register(formData).subscribe({
      next: () => {
        const role = this.roleValue;
        if (role === 'Student') {
          this.router.navigate(['/student/profile']);
        
        } else if (role === 'Recruiter') {
          this.router.navigate(['/recruiter/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => console.error(err)
    });
  }
}
