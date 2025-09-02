import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { TokenService } from "../../core/services/token.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.tokenService.setToken(res.token);
        this.tokenService.setRefreshToken(res.refreshToken);

        // Navigate based on role
        const roles = this.tokenService.getRoles();
        if (roles.includes('Admin')) {
          this.router.navigate(['/admin-dashboard']);
        } else if (roles.includes('Recruiter')) {
          this.router.navigate(['/recruiter-dashboard']);
        } else if (roles.includes('Student')) {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        console.error('Login failed:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}