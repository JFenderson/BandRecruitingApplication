// src/app/pages/students-list/students-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { TokenService } from '../../core/services/token.service';
import { UserDTO } from '../../core/models/user.model';
import { INSTRUMENT_OPTIONS } from '../../constants/insturments';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Discover Talented Musicians</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect students for your marching band program. Browse profiles, watch performances, and connect with talented musicians.
            </p>
          </div>
          
          <!-- Search and Filters -->
          <div class="mt-8 max-w-4xl mx-auto">
            <form [formGroup]="searchForm" class="space-y-4">
              <!-- Search Bar -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  formControlName="searchTerm"
                  (input)="applyFilters()"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name, instrument, or high school...">
              </div>
              
              <!-- Filters -->
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <select formControlName="instrument" (change)="applyFilters()" 
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Instruments</option>
                    <option *ngFor="let instrument of instruments" [value]="instrument">{{ instrument }}</option>
                  </select>
                </div>
                
                <div>
                  <select formControlName="graduationYear" (change)="applyFilters()"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Graduation Years</option>
                    <option *ngFor="let year of graduationYears" [value]="year">{{ year }}</option>
                  </select>
                </div>
                
                <div>
                  <select formControlName="ratingRange" (change)="applyFilters()"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Ratings</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                    <option value="2+">2+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <select formControlName="hasVideos" (change)="applyFilters()"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Students</option>
                    <option value="true">With Videos</option>
                    <option value="false">Without Videos</option>
                  </select>
                </div>
                
                <div>
                  <select formControlName="sortBy" (change)="applySort()"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="graduation">Sort by Graduation</option>
                    <option value="recent">Sort by Recent</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Results Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ filteredStudents.length }} Student{{ filteredStudents.length !== 1 ? 's' : '' }} Found
          </h2>
          
          <div class="flex items-center space-x-4">
            <button 
              [class]="viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
              (click)="viewMode = 'grid'"
              class="p-2 border border-gray-300 rounded-lg hover:bg-blue-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            
            <button 
              [class]="viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
              (click)="viewMode = 'list'"
              class="p-2 border border-gray-300 rounded-lg hover:bg-blue-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div *ngIf="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let student of paginatedStudents" 
               class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div class="relative">
              <div class="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <img 
                  [src]="student.profilePicture || '/assets/default-avatar.png'" 
                  [alt]="student.firstName + ' ' + student.lastName"
                  class="w-20 h-20 rounded-full object-cover border-4 border-white">
              </div>
              
              <!-- Rating Badge -->
              <div class="absolute top-2 right-2">
                <span class="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded-full text-sm font-medium flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ student.averageRating || 0 | number:'1.1-1' }}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ student.firstName }} {{ student.lastName }}
              </h3>
              <p class="text-sm text-gray-600 mb-2">{{ student.instrument }}</p>
              <p class="text-xs text-gray-500 mb-3">{{ student.highSchool }} • Class of {{ student.graduationYear }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  {{ getVideoCount(student) }} videos
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ getOfferCount(student) }} offers
                </span>
              </div>
              
              <div class="flex space-x-2">
                <button 
                  [routerLink]="['/student-profile', student.id]"
                  class="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                  View Profile
                </button>
                
                <button 
                  (click)="makeOffer(student)"
                  class="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div *ngIf="viewMode === 'list'" class="space-y-4">
          <div *ngFor="let student of paginatedStudents" 
               class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1">
                <img [src]="student.profilePicture || '/assets/default-avatar.png'" 
                     [alt]="student.firstName + ' ' + student.lastName"
                     class="w-16 h-16 rounded-full object-cover">
                
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">
                      {{ student.firstName }} {{ student.lastName }}
                    </h3>
                    <div class="flex items-center">
                      <ng-container *ngFor="let star of [1,2,3,4,5]">
                        <svg 
                          [class]="star <= (student.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                          class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </ng-container>
                      <span class="ml-2 text-sm text-gray-600">
                        {{ student.averageRating || 0 | number:'1.1-1' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-6 text-sm text-gray-600">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                      </svg>
                      {{ student.instrument }}
                    </span>
                    
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      {{ student.highSchool }}
                    </span>
                    
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Class of {{ student.graduationYear }}
                    </span>
                    
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      {{ getVideoCount(student) }} videos
                    </span>
                    
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{ getOfferCount(student) }} offers
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  [routerLink]="['/student-profile', student.id]"
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
                
                <button 
                  (click)="makeOffer(student)"
                  class="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Make Offer
                </button>
                
                <button 
                  (click)="addToWatchlist(student)"
                  class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredStudents.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <button 
            (click)="clearFilters()"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Clear All Filters
          </button>
        </div>

        <!-- Pagination -->
        <div *ngIf="filteredStudents.length > pageSize" class="flex justify-center items-center space-x-2 mt-8">
          <button 
            (click)="previousPage()" 
            [disabled]="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span>Previous</span>
          </button>
          
          <div class="flex items-center space-x-1">
            <button 
              *ngFor="let page of getPageNumbers()" 
              (click)="goToPage(page)"
              [class]="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="px-3 py-2 border border-gray-300 rounded-lg font-medium">
              {{ page }}
            </button>
          </div>
          
          <button 
            (click)="nextPage()" 
            [disabled]="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-2">
            <span>Next</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class StudentsListComponent implements OnInit {
  allStudents: UserDTO[] = [];
  filteredStudents: UserDTO[] = [];
  paginatedStudents: UserDTO[] = [];
  
  searchForm!: FormGroup;
  instruments = INSTRUMENT_OPTIONS;
  graduationYears: number[] = [];
  
  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;

  constructor(
    private studentService: StudentService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.generateGraduationYears();
    this.loadStudents();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      instrument: [''],
      graduationYear: [''],
      ratingRange: [''],
      hasVideos: [''],
      sortBy: ['name']
    });
  }

  generateGraduationYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 6; year++) {
      this.graduationYears.push(year);
    }
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.allStudents = students;
        this.filteredStudents = [...students];
        this.applySort();
        this.updatePagination();
      },
      error: (error) => console.error('Error loading students:', error)
    });
  }

  applyFilters(): void {
    const formValue = this.searchForm.value;
    
    this.filteredStudents = this.allStudents.filter(student => {
      const matchesSearch = !formValue.searchTerm || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(formValue.searchTerm.toLowerCase()) ||
        student.instrument?.toLowerCase().includes(formValue.searchTerm.toLowerCase()) ||
        student.highSchool?.toLowerCase().includes(formValue.searchTerm.toLowerCase());

      const matchesInstrument = !formValue.instrument || student.instrument === formValue.instrument;
      const matchesGradYear = !formValue.graduationYear || student.graduationYear === parseInt(formValue.graduationYear);
      
      const matchesRating = !formValue.ratingRange || (() => {
        const rating = student.averageRating || 0;
        switch (formValue.ratingRange) {
          case '4+': return rating >= 4;
          case '3+': return rating >= 3;
          case '2+': return rating >= 2;
          default: return true;
        }
      })();

      const matchesVideos = !formValue.hasVideos || (() => {
        const hasVideos = this.getVideoCount(student) > 0;
        return formValue.hasVideos === 'true' ? hasVideos : !hasVideos;
      })();

      return matchesSearch && matchesInstrument && matchesGradYear && matchesRating && matchesVideos;
    });

    this.currentPage = 1;
    this.applySort();
    this.updatePagination();
  }

  applySort(): void {
    const sortBy = this.searchForm.get('sortBy')?.value;
    
    this.filteredStudents.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'graduation':
          return (a.graduationYear || 0) - (b.graduationYear || 0);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      instrument: '',
      graduationYear: '',
      ratingRange: '',
      hasVideos: '',
      sortBy: 'name'
    });
    this.applyFilters();
  }

  makeOffer(student: UserDTO): void {
    // Implement make offer functionality
    console.log('Make offer to:', student);
  }

  addToWatchlist(student: UserDTO): void {
    // Implement watchlist functionality
    console.log('Add to watchlist:', student);
  }

  getVideoCount(student: UserDTO): number {
    // Mock video count - in real app, this would come from the student data
    return Math.floor(Math.random() * 5) + 1;
  }

  getOfferCount(student: UserDTO): number {
    // Mock offer count - in real app, this would come from the student data
    return student.offerCount || 0;
  }
}