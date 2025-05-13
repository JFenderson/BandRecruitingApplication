import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { Component } from '@angular/core';
import { TokenService } from "../../core/services/token.service";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false
})


export class LoginComponent {
  loginForm: FormGroup;
  
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


  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.tokenService.getRole();

        if (role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'Recruiter') {
          this.router.navigate(['/recruiter-dashboard']);
        } else {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: err => {
        console.error('Login failed', err);
        // Optionally show error message
      }
    });
  }
}

