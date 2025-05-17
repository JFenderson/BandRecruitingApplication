import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { RatingDTO } from "../models/rating.model";

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(private api: ApiService) {}

  rateStudent(studentId: string, recruiterId: string, data: any) {
    return this.api.post<any>(`api/Rating/student/${studentId}/rate?recruiterId=${recruiterId}`, data);
  }

  getStudentAverage(studentId: string) {
    return this.api.get<number>(`api/Rating/student/${studentId}/averageRating`);
  }

  getRatingsByStudent(studentId: string) {
    return this.api.get<any[]>(`api/Rating/student/${studentId}/ratings`);
  }

  getRatingsByVideo(videoId: string) {
    return this.api.get<any[]>(`api/Rating/video/${videoId}/ratings`);
  }

    getByVideo(videoId: string): Observable<RatingDTO[]> {
    return this.api.get<RatingDTO[]>(`videos/${videoId}/ratings`);
  }

  add(videoId: string, rating: RatingDTO): Observable<RatingDTO> {
    return this.api.post<RatingDTO>(`videos/${videoId}/ratings`, rating);
  }
} 
