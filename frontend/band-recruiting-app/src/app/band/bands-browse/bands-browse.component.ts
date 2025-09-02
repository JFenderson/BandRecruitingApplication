// src/app/pages/bands-browse/bands-browse.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BandService } from '../../core/services/band.service';
import { StudentService } from '../../core/services/student.service';
import { BandDTO } from '../../core/models/band.model';
import { TokenService } from '../../core/services/token.service';
import { UpdateInterestDTO } from '../../core/models/interest.model';


@Component({
  selector: 'app-bands-browse',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./bands-browse.component.html"
})
export class BandsBrowseComponent implements OnInit {
  allBands: BandDTO[] = [];
  filteredBands: BandDTO[] = [];
  paginatedBands: BandDTO[] = [];

  searchForm!: FormGroup;
  availableStates: string[] = [];
  interestedBandIds: string[] = [];

  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  showConfirm = false;
  bandToConfirm: BandDTO | null = null;
  isCurrentlyInterested = false;
  showToast = false;
  toastMessage = '';

  constructor(
    private bandService: BandService,
    private studentService: StudentService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadBands();
    this.loadUserInterests();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      division: [''],
      conference: [''],
      state: [''],
      sortBy: ['name']
    });
  }



  loadBands(): void {
    this.bandService.getAllBands().subscribe({
      next: (bands) => {
        this.allBands = bands;
        this.filteredBands = [...bands];
        this.extractAvailableStates();
        this.applySort();
        this.updatePagination();
      },
      error: (error) => console.error('Error loading bands:', error)
    });
  }

  loadUserInterests(): void {
    const currentUser = this.tokenService.decodeToken();
          console.log("user interest",currentUser);

    if (currentUser?.sub) {
      // Load user's band interests
      this.studentService.getStudentInterests(currentUser.sub).subscribe({
        next: (interests) => {
          this.interestedBandIds = interests.map(i => i.bandId);
          console.log(interests);
        },
        error: (err) => console.error('Error loading interests', err)
      });
    }
  }

  openInterestConfirm(band: BandDTO): void {
    this.bandToConfirm = band;
    this.isCurrentlyInterested = this.isInterested(band);
    this.showConfirm = true;
  }

  closeInterestConfirm(): void {
    this.showConfirm = false;
    this.bandToConfirm = null;
  }

  extractAvailableStates(): void {
    const states = [...new Set(this.allBands
      .map(band => band.state)
      .filter((state): state is string => typeof state === 'string')
    )];

    this.availableStates = states.sort();
  }


  applyFilters(): void {
    const formValue = this.searchForm.value;

    this.filteredBands = this.allBands.filter(band => {
      const matchesSearch = !formValue.searchTerm ||
        band.name?.toLowerCase().includes(formValue.searchTerm.toLowerCase()) ||
        band.schoolName?.toLowerCase().includes(formValue.searchTerm.toLowerCase()) ||
        band.city?.toLowerCase().includes(formValue.searchTerm.toLowerCase()) ||
        band.state?.toLowerCase().includes(formValue.searchTerm.toLowerCase());

      const matchesDivision = !formValue.division || band.division === formValue.division;
      const matchesConference = !formValue.conference || band.conference === formValue.conference;
      const matchesState = !formValue.state || band.state === formValue.state;

      return matchesSearch && matchesDivision && matchesConference && matchesState;
    });

    this.currentPage = 1;
    this.applySort();
    this.updatePagination();
  }

  applySort(): void {
    const sortBy = this.searchForm.get('sortBy')?.value;

    this.filteredBands.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'state':
          return (a.state || '').localeCompare(b.state || '');
        case 'division':
          return (a.division || '').localeCompare(b.division || '');
        case 'recruiters':
          return (b.recruiterCount || 0) - (a.recruiterCount || 0);
        default:
          return 0;
      }
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBands.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBands = this.filteredBands.slice(startIndex, endIndex);
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

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      division: '',
      conference: '',
      state: '',
      sortBy: 'name'
    });
    this.applyFilters();
  }

  toggleInterest(band: BandDTO): void {
    const currentUser = this.tokenService.decodeToken();
    if (!currentUser?.nameid) return;

    const studentId = currentUser.nameid;
    const bandId = band.bandId;
    const isCurrentlyInterested = this.isInterested(band); // Your own logic to check local interest

    const dto: UpdateInterestDTO = {
      bandId,
      isInterested: !isCurrentlyInterested
    };

    this.studentService.updateInterest(studentId, dto).subscribe({
      next: () => {
        if (dto.isInterested) {
          this.interestedBandIds.push(bandId);
          console.log('Interest expressed.');
        } else {
          this.interestedBandIds = this.interestedBandIds.filter(id => id !== bandId);
          console.log('Interest removed.');
        }
      },
      error: (error: any) => {
        console.error('Error updating interest:', error);
        // Optional: show toast or rollback UI state
      }
    });
  }


  isInterested(band: BandDTO): boolean {
    return this.interestedBandIds.includes(band.bandId);
  }

  confirmExpressInterest(): void {
    if (!this.bandToConfirm) return;
    const token = this.tokenService.decodeToken();
    const studentId = token?.sub;
    if (!studentId) {
      console.log("studentId", token)
      console.error('Missing studentId from token');
      this.closeInterestConfirm();
      return;
    }

    const bandId = this.bandToConfirm.bandId;
    const bandName = this.bandToConfirm.name;
    const willBeInterested = !this.isCurrentlyInterested;
    console.log(bandId);
    console.log(bandName);
    // Recommended idempotent API
    const dto: UpdateInterestDTO = { bandId, isInterested: willBeInterested };
    this.studentService.updateInterest(studentId, dto).subscribe({

      next: () => this.onInterestSuccess(bandName ?? 'this band', bandId, willBeInterested),
      error: (err: any) => this.onInterestError(err)

    });
    // --- If you still only have addInterest (temporary) ---
    // this.studentService.addInterest(studentId, bandId).subscribe({
    //   next: () => this.onInterestSuccess(this.bandToConfirm!.name),
    //   error: (err: any) => this.onInterestError(err)
    // });
  }

  private onInterestSuccess(bandName: string, bandId: string, nowInterested: boolean): void {
    if (!this.bandToConfirm) return;
    this.closeInterestConfirm();

    // keep local UI in sync if you store interest ids locally
    if (nowInterested) {
      console.log("bandconfirm", bandName)
      this.interestedBandIds = [...this.interestedBandIds, bandId];
      this.toastMessage = `You've expressed interest in ${bandName}!`;
    } else {
      this.interestedBandIds = this.interestedBandIds.filter(id => id !== bandId);
      this.toastMessage = `You've withdrawn interest from ${bandName}.`;
    }

    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.router.navigate(['/student-dashboard']);
    }, 1200);
  }

  private onInterestError(err: any): void {
    console.error('Error expressing interest:', err);
    this.closeInterestConfirm();
    this.toastMessage = 'Something went wrong. Please try again.';
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2000);
  }

  private toast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2000);
  }
}

