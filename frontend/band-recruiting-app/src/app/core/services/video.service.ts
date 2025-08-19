import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { AddVideoDTO, VideoDTO } from "../models/video.model";
import { RatingDTO } from "../models/rating.model";
import { CommentDTO } from "../models/comment.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class VideoService {
  constructor(private api: ApiService) {}

  getAllVideos() {
    return this.api.get<VideoDTO[]>('videos');
  }

  getVideoById(id: number) {
    return this.api.get<VideoDTO>(`videos/${id}`);
  }

  uploadVideo(formData: FormData) {
    return this.api.post<AddVideoDTO>('videos/upload', formData);
  }

  updateVideo(id: number, formData: FormData) {
    return this.api.put<any>(`videos/${id}`, formData);
  }

  deleteVideo(id: number) {
    return this.api.delete<any>(`videos/${id}`);
  }

  getVideoRatings(id: string) {
    return this.api.get<RatingDTO[]>(`videos/${id}/ratings`);
  }

  getVideoComments(id: string) {
    return this.api.get<CommentDTO[]>(`videos/${id}/comments`);
  }

    getByStudent(studentId: string): Observable<VideoDTO[]> {
    return this.api.get<VideoDTO[]>(`students/${studentId}/videos`);
  }

  add(studentId: string, video: VideoDTO): Observable<VideoDTO> {
    return this.api.post<VideoDTO>(`students/${studentId}/videos`, video);
  }
}