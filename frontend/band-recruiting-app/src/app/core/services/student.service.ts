import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserDTO, UpdateUserDTO } from '../models/user.model';
import { VideoDTO } from '../models/video.model';
import { RatingDTO } from '../models/rating.model';
import { CommentDTO } from '../models/comment.model';
import { OfferDTO } from '../models/offer.model';
import { InterestDTO, UpdateInterestDTO } from '../models/interest.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  constructor(private api: ApiService) {}

  getAllStudents(): Observable<UserDTO[]> {
    return this.api.get<UserDTO[]>('students');
  }

  getStudentById(id: string): Observable<UserDTO> {
    return this.api.get<UserDTO>(`students/${id}`);
  }

  updateStudent(id: string, data: UpdateUserDTO): Observable<void> {
    return this.api.put<void>(`students/${id}`, data);
  }

  deleteStudent(id: string): Observable<void> {
    return this.api.delete<void>(`students/${id}`);
  }

  getStudentVideos(id: string): Observable<VideoDTO[]> {
    return this.api.get<VideoDTO[]>(`students/${id}/videos`);
  }

  getStudentRatings(id: string): Observable<RatingDTO[]> {
    return this.api.get<RatingDTO[]>(`students/${id}/ratings`);
  }

  getStudentComments(id: string): Observable<CommentDTO[]> {
    return this.api.get<CommentDTO[]>(`students/${id}/comments`);
  }

  getStudentOffers(id: string): Observable<OfferDTO[]> {
    return this.api.get<OfferDTO[]>(`students/${id}/offers`);
  }

  getStudentInterests(id: string): Observable<InterestDTO[]> {
    return this.api.get<InterestDTO[]>(`students/${id}/interests`);
  }




updateInterest(studentId: string,bandId: string, dto: { isInterested: boolean }) {
  return this.api.put(`students/${studentId}/interests/${bandId}`, dto);
}


}