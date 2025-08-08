import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDTO, UpdateStudentDTO } from '../models/student.model';
import { ApiService } from './api.service';
import { UserDTO } from '../models/user.model';
import { OfferDTO } from '../models/offer.model';
import { VideoDTO } from '../models/video.model';
import { RatingDTO } from '../models/rating.model';
import { CommentDTO } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  getById(studentId: string) {
    throw new Error('Method not implemented.');
  }
  update(studentId: string, changes: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private api: ApiService) {}

  getAllStudents() {
    return this.api.get<StudentDTO[]>('Student/students');
  }

  getStudentById(id: string) {
    return this.api.get<StudentDTO>(`Student/${id}`);
  }

updateStudent(id: string, data: UpdateStudentDTO): Observable<StudentDTO> {
   return this.api.put<StudentDTO>(`Student/${id}`, data);
 }

  deleteStudent(id: string) {
    return this.api.delete<any>(`Student/${id}`);
  }

  createStudent(data: any) {
    return this.api.post<StudentDTO>('Student', data);
  }

  getByGradYear(year: number) {
    return this.api.get<StudentDTO[]>(`Student/gradYear/${year}`);
  }

  getByInstrument(instrument: string) {
    return this.api.get<StudentDTO[]>(`Student/instrument/${instrument}`);
  }

    getAllInstruments(): Observable<StudentDTO[]> {
      return this.api.get<StudentDTO[]>('Student/instrument');
    }

  getStudentVideos(id: string) {
    return this.api.get<VideoDTO[]>(`Student/${id}/videos`);
  }

  getStudentRatings(id: string) {
    return this.api.get<RatingDTO[]>(`Student/${id}/ratings`);
  }

  getStudentComments(id: string) {
    return this.api.get<CommentDTO[]>(`Student/${id}/comments`);
  }

  getStudentOffers(id: string) {
    return this.api.get<OfferDTO[]>(`Student/${id}/offers`);
  }

  expressInterest(studentId: string, bandId: string) {
    return this.api.post<StudentDTO>(`Student/${studentId}/interests`, { bandId });
  }

  getInterests(studentId: string) {
    return this.api.get<StudentDTO[]>(`Student/${studentId}/interests`);
  }
}