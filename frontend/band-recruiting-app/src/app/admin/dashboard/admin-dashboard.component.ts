import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent implements OnInit {
  role: string | null = null;

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.role = this.tokenService.getRole();
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  isRecruiter(): boolean {
    return this.role === 'Recruiter';
  }

    isStudent(): boolean {
    return this.role === 'Student';
  }
}
