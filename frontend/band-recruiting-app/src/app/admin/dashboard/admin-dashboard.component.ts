import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component'; // Adjust the path if needed


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SpinnerComponent],
})
export class AdminDashboardComponent implements OnInit {
sortUsers(arg0: string) {
throw new Error('Method not implemented.');
}
  role: string | null = null;
  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 20;
  isLoading = true;


  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) { }


  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load users', err);
      }
    });
  }

  filterUsers(): void {
    this.applyFilters();
  }


  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();

    // Filter
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.userType.toLowerCase().includes(term)
    );

    // Sort
    if (this.sortField) {
      this.filteredUsers.sort((a, b) => {
        let aValue = '', bValue = '';

        if (this.sortField === 'name') {
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        } else {
          aValue = (a as any)[this.sortField]?.toLowerCase?.() ?? '';
          bValue = (b as any)[this.sortField]?.toLowerCase?.() ?? '';
        }

        const compare = aValue.localeCompare(bValue);
        return this.sortDirection === 'asc' ? compare : -compare;
      });
    }

    // Reset pagination if needed
    const totalPages = this.totalPages;
    if (this.currentPage > totalPages) this.currentPage = totalPages || 1;
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
