// student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSummaryCardComponent } from '../components/student-summary-card/student-summary-card.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { VideoUploaderComponent } from '../components/video-uploader/video-uploader.component';
import { VideoListComponent } from '../components/video-list/video-list.component';
import { OfferListComponent } from '../components/offer-list/offer-list.component';
import { InterestListComponent } from '../components/interest-list/interest-list.component';
import { CommentListComponent } from '../components/comment-list/comment-list.component';
import { StudentDTO } from '../../core/models/student.model';
import { StudentService } from '../../core/services/student.service';
import { TokenService } from '../../core/services/token.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { OfferDTO } from '../../core/models/offer.model';
import { UserDTO } from '../../core/models/user.model';
import { VideoDTO } from '../../core/models/video.model';
import { BandService } from '../../core/services/band.service';
import { OfferService } from '../../core/services/offer.service';
import { VideoService } from '../../core/services/video.service';
import { RouterModule } from '@angular/router';
import { InterestService } from '../../core/services/interest.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    StudentSummaryCardComponent,
    StarRatingComponent,
    VideoUploaderComponent,
    VideoListComponent,
    OfferListComponent,
    InterestListComponent,
    CommentListComponent
  ],
templateUrl: './student-dashboard.component.html'
})

export class StudentDashboardComponent implements OnInit {
  currentUser!: UserDTO;
  videos: VideoDTO[] = [];
  offers: OfferDTO[] = [];
  interests: any[] = [];
  upcomingEvents: any[] = [];
  
  showVideoUploadModal = false;
  videoUploadForm!: FormGroup;
  selectedVideoFile: File | null = null;
pageSize = 5;
currentPage = 1;

  constructor(
    private tokenService: TokenService,
    private studentService: StudentService,
    private videoService: VideoService,
    private offerService: OfferService,
    private bandService: BandService,
    private interestService: InterestService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
   this.initVideoUploadForm();
  this.loadCurrentUser();         // This now includes loadDashboardData()
  this.loadUpcomingEvents();
  }

  initVideoUploadForm(): void {
    this.videoUploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

 loadCurrentUser(): void {
  const token = this.tokenService.decodeToken();
  console.log(token);
  if (token?.sub) {
    this.studentService.getStudentById(token.sub).subscribe({
      next: (user) => {
        this.currentUser = user;

        this.loadDashboardData(); // 🔁 Call only after user is set
      },
      error: (error) => {
        console.error('Failed to load current user:', error);
      }
    });
  }
      console.log("current user", this.currentUser);

}

  loadDashboardData(): void {
    if (this.currentUser?.id) {
      // Load videos
      this.videoService.getByStudent(this.currentUser.id).subscribe(videos => {
        this.videos = videos;
      });

      // Load offers
      this.offerService.getOffersByStudent(this.currentUser.id).subscribe(offers => {
        this.offers = offers;
        console.log(offers)
      });

      // Load interests (mock data for now)
      this.interestService.getByStudent(this.currentUser.id).subscribe(interests => {
        this.interests = interests;
      });
    }
      console.log("current user", this.currentUser);

  }

  loadUpcomingEvents(): void {
    // Mock upcoming events
    this.upcomingEvents = [
      {
        title: 'Band Showcase Event',
        date: new Date(2024, 2, 15),
        location: 'Music Hall'
      },
      {
        title: 'Scholarship Deadline',
        date: new Date(2024, 2, 30),
        location: 'Online Application'
      }
    ];
  }

  openVideoUploadModal(): void {
    this.showVideoUploadModal = true;
  }

  closeVideoUploadModal(): void {
    this.showVideoUploadModal = false;
    this.videoUploadForm.reset();
    this.selectedVideoFile = null;
  }

  onVideoFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedVideoFile = file;
    }
  }

  uploadVideo(): void {
    if (this.videoUploadForm.invalid || !this.selectedVideoFile || !this.currentUser?.id) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedVideoFile);
    formData.append('title', this.videoUploadForm.get('title')?.value);
    formData.append('description', this.videoUploadForm.get('description')?.value);
    formData.append('studentId', this.currentUser.id);

    this.videoService.uploadVideo(formData).subscribe({
      next: () => {
        this.closeVideoUploadModal();
        this.loadDashboardData(); // Reload videos
      },
      error: (error) => console.error('Error uploading video:', error)
    });
  }

  acceptOffer(offer: OfferDTO): void {
    this.offerService.acceptOffer(offer.offerId, offer.studentId).subscribe({
      next: () => {
        this.loadDashboardData(); // Reload offers
      },
      error: (error) => console.error('Error accepting offer:', error)
    });
  }

  declineOffer(offer: OfferDTO): void {
    this.offerService.declineOffer(offer.offerId, offer.studentId).subscribe({
      next: () => {
        this.loadDashboardData(); // Reload offers
      },
      error: (error) => console.error('Error declining offer:', error)
    });
  }

  getOfferStatusClass(status: string): string {
    const classes = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Declined': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getVideoViews(video: VideoDTO): number {
    // Mock view count - in real app, this would come from the video data
    return Math.floor(Math.random() * 100) + 10;
  }

  getVideoRating(video: VideoDTO): number {
    // Mock rating - in real app, this would come from the video data
    return Math.random() * 2 + 3; // Random rating between 3-5
  }

get paginatedOffers(): OfferDTO[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.offers.slice(start, start + this.pageSize);
}

totalPages(): number {
  return Math.ceil(this.offers.length / this.pageSize);
}

nextPage(): void {
  if (this.currentPage < this.totalPages()) {
    this.currentPage++;
  }
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

}