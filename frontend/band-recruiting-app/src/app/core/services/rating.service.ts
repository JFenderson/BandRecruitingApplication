import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { RatingDTO } from "../models/rating.model";

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(private api: ApiService) {}

  rateStudent(studentId: string, recruiterId: string, data: any): Observable<RatingDTO> {
    return this.api.post<RatingDTO>(`ratings/student/${studentId}/rate?recruiterId=${recruiterId}`, data);
  }

  getStudentAverage(studentId: string): Observable<number> {
    return this.api.get<number>(`ratings/student/${studentId}/averageRating`);
  }

  getRatingsByStudent(studentId: string): Observable<RatingDTO[]> {
    return this.api.get<RatingDTO[]>(`ratings/student/${studentId}/ratings`);
  }

  getRatingsByVideo(videoId: string): Observable<RatingDTO[]> {
    return this.api.get<RatingDTO[]>(`ratings/video/${videoId}/ratings`);
  }

  // Add the missing method
  getByStudent(studentId: string): Observable<RatingDTO[]> {
    return this.getRatingsByStudent(studentId);
  }

  getByVideo(videoId: string): Observable<RatingDTO[]> {
    return this.getRatingsByVideo(videoId);
  }

  add(videoId: string, rating: RatingDTO): Observable<RatingDTO> {
    return this.api.post<RatingDTO>(`videos/${videoId}/ratings`, rating);
  }
}