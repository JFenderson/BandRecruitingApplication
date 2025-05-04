import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,

})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    this.http.post<{ token: string }>('/api/login', payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Store JWT
        this.router.navigate(['/dashboard']); // Redirect
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
