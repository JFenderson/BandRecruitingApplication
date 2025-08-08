import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component'; // Adjust the path if needed
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SpinnerComponent, BaseChartDirective],
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
  totalStudents = 0;
  totalRecruiters = 0;
  totalOffers = 0;
  isSummaryLoading = true;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  barChartLabels: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [5, 8, 3, 6, 4, 7, 2], label: 'Scholarship Offers' }
    ]
  };

  barChartType: ChartType = 'bar';

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private dashboardService: DashboardService,
    private toast: ToastrService
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

    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.totalStudents = data.totalStudents;
        this.totalRecruiters = data.totalRecruiters;
        this.totalOffers = data.totalOffers;
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
      }
    });
  }

  filterUsers(): void {
    this.applyFilters();
  }

  refreshSummary(): void {
    this.isSummaryLoading = true;
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.totalStudents = data.totalStudents;
        this.totalRecruiters = data.totalRecruiters;
        this.totalOffers = data.totalOffers;
        this.isSummaryLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
        this.isSummaryLoading = false;
      }
    });
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

  getProfileLink(user: UserDTO): string[] | null {
    if (user.userType === 'Student') {
      return ['/student-profile', user.id];
    } else if (user.userType === 'Recruiter') {
      return ['/recruiter-profile', user.id];
    } else {
      return null;
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

  deleteUser(user: UserDTO): void {
    const confirmed = confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`);
    if (!confirmed) return;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.toast.success('User deleted successfully');
        this.users = this.users.filter(u => u.id !== user.id);
        this.applyFilters();
      },
      error: () => {
        this.toast.error('Failed to delete user');
      }
    });
  }
}
