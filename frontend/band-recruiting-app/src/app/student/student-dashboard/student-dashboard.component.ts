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

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StudentSummaryCardComponent,
    StarRatingComponent,
    VideoUploaderComponent,
    VideoListComponent,
    OfferListComponent,
    InterestListComponent,
    CommentListComponent
  ],

})

export class StudentDashboardComponent implements OnInit {
  student!: StudentDTO;

  constructor(
    private studentService: StudentService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const studentId = this.tokenService.decodeToken()?.nameid;
    if (studentId) {
      this.studentService.getStudentById(studentId).subscribe(s => {
        this.student = s;
      });
    }
  }
}
