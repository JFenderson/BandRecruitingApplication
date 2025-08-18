import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { Component } from '@angular/core';
import { TokenService } from "../../core/services/token.service";
import { jwtDecode } from "jwt-decode";
import { CommonModule } from "@angular/common";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
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


  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }


    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {

        console.log("Token", res);
        this.tokenService.setToken(res.token);
        this.tokenService.setRefreshToken(res.refreshToken);

        const roles = this.tokenService.getRoles(); // normalized
        const routeByRole = new Map<string, string>([
          ['Admin', '/admin-dashboard'],
          ['Recruiter', '/recruiter-dashboard'],
          ['Student', '/student-dashboard'],
        ]);

        const target = roles.map(r => routeByRole.get(r)).find(Boolean) ?? '/unauthorized';
        this.router.navigateByUrl(target);
      },
      error: (err) => {
        console.error('[DEBUG] Login failed:', err);
      }
    });
  }


}

