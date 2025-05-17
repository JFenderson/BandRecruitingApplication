import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { AddCommentDTO, CommentDTO } from "../models/comment.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private api: ApiService) {}

  getAllComments() {
    return this.api.get<CommentDTO[]>('api/Comments');
  }

  getCommentById(id: number) {
    return this.api.get<CommentDTO>(`api/Comments/${id}`);
  }

  createComment(data: any) {
    return this.api.post<AddCommentDTO>('api/Comments', data);
  }

  updateComment(id: string, data: any) {
    return this.api.put<CommentDTO>(`api/Comments/${id}`, data);
  }

  deleteComment(id: number) {
    return this.api.delete<any>(`api/Comments/${id}`);
  }

    getByVideo(videoId: string): Observable<CommentDTO[]> {
    return this.api.get<CommentDTO[]>(`videos/${videoId}/comments`);
  }

  add(videoId: string, comment: CommentDTO): Observable<CommentDTO> {
    return this.api.post<CommentDTO>(`videos/${videoId}/comments`, comment);
  }
}