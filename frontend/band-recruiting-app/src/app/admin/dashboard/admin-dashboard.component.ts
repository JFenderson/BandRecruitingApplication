import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false,
})
export class AdminDashboardComponent implements OnInit {
  role: string | null = null;
  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  searchTerm: string = '';
  sortField: string = '';
sortDirection: 'asc' | 'desc' = 'asc';
currentPage: number = 1;
itemsPerPage: number = 20;


  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users]; // Initialize filtered list
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }

    filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.userType.toLowerCase().includes(term)
    );
  }

  sortUsers(field: string): void {
  if (this.sortField === field) {
    // Toggle sort direction
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // New sort field
    this.sortField = field;
    this.sortDirection = 'asc';
  }

  this.filteredUsers.sort((a: any, b: any) => {
    let aValue: string = '';
    let bValue: string = '';

    if (field === 'name') {
      aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
      bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
    } else {
      aValue = a[field]?.toLowerCase?.() ?? '';
      bValue = b[field]?.toLowerCase?.() ?? '';
    }

    const compare = aValue.localeCompare(bValue);
    return this.sortDirection === 'asc' ? compare : -compare;
  });
}

get pagedUsers(): UserDTO[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
}

get totalPages(): number {
  return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
}

getProfileLink(user: UserDTO): string[] {
  if (user.userType === 'Student') {
    return ['/student-profile', user.id];
  } else if (user.userType === 'Recruiter') {
    return ['/recruiter-profile', user.id];
  } else {
    return ['/unauthorized']; // or just disable the button for Admins
  }
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
