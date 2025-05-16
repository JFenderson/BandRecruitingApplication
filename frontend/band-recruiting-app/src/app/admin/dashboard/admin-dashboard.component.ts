import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false
 
})

export class AdminDashboardComponent implements OnInit {
  role: string | null = null;
users: UserDTO[] = [];
  constructor(private tokenService: TokenService, private userService: UserService) {}

ngOnInit(): void {
  this.userService.getAll().subscribe({
    next: (data) => {
      console.log('[DEBUG] API Response:', data);
      this.users = data;
    },
    error: (err) => console.error('Failed to load users', err)
  });
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

  logout(): void {
  this.tokenService.logout();
}
}
