import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecruiterService } from '../../core/services/recruiter.service';
import { UserDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class RecruiterProfileComponent implements OnInit {
  recruiterId!: string;
  recruiter!: UserDTO;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private recruiterService: RecruiterService
  ) {}

  ngOnInit(): void {
    this.recruiterId = this.route.snapshot.paramMap.get('id')!;
    this.loadRecruiter();
  }

  loadRecruiter(): void {
    this.isLoading = true;
    this.recruiterService.getRecruiterById(this.recruiterId).subscribe({
      next: recruiter => {
        this.recruiter = recruiter;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to load recruiter profile';
        this.isLoading = false;
        console.error('Failed to load recruiter:', err);
      }
    });
  }
}