import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { Component } from '@angular/core';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;
    if (email && password) {
      this.authService.login({ email, password }).subscribe({
        next: () => this.router.navigate(['/']),
        error: err => console.error(err)
      });
    }
  }
}
