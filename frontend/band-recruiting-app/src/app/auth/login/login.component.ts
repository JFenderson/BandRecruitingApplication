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

      console.log("Token",res);
      this.tokenService.setToken(res.token);
      this.tokenService.setRefreshToken(res.refreshToken);
     const decoded = jwtDecode<any>(res.token);
      console.log('[DEBUG] Decoded Token:', decoded);

      const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      

          if (!role) {
        console.warn('[WARNING] Role not found in token, routing to fallback');
        this.router.navigate(['/unauthorized']);
        return;
      }

      if (role === 'Admin') {
        this.router.navigate(['/admin-dashboard']);
        console.log('[ROUTING] Navigating to Admin Dashboard');
      } else if (role === 'Recruiter') {
        this.router.navigate(['/recruiter-dashboard']);
        console.log('[ROUTING] Navigating to Recruiter Dashboard');
      } else {
        this.router.navigate(['/student-dashboard']);
        console.log('[ROUTING] Navigating to Student Dashboard');
      }
    },
    error: (err) => {
      console.error('[DEBUG] Login failed:', err);
    }
  });
}


}

