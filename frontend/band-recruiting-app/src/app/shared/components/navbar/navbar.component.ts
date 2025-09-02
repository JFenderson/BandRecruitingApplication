import { Component } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface JwtPayload {
  sub: string;
  email: string;
  nameid: string;
  given_name?: string;  // Add optional properties
  name?: string;
  role?: string | string[];
  exp: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  constructor(private tokenService: TokenService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }

  get isRecruiter(): boolean {
    return this.tokenService.isRecruiter();
  }

  get isStudent(): boolean {
    return this.tokenService.isStudent();
  }

  get userFirstName(): string {
    const payload = this.tokenService.decodeToken() as JwtPayload | null;
    return payload?.given_name || payload?.name || 'User';
  }

  logout(): void {
    this.tokenService.logout();
  }
}