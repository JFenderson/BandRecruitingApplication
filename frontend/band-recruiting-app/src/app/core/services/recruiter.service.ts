import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { UserDTO } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RecruiterService {
  constructor(private api: ApiService) {}

  getAllRecruiters(): Observable<UserDTO[]> {
    return this.api.get<UserDTO[]>('recruiters');
  }

  getRecruiterById(id: string): Observable<UserDTO> {
    return this.api.get<UserDTO>(`recruiters/${id}`);
  }

  updateRecruiter(id: string, data: any): Observable<UserDTO> {
    return this.api.put<UserDTO>(`recruiters/${id}`, data);
  }

  deleteRecruiter(id: string): Observable<void> {
    return this.api.delete<void>(`recruiters/${id}`);
  }

  createRecruiter(data: any): Observable<UserDTO> {
    return this.api.post<UserDTO>('recruiters', data);
  }

  getRecruiterBand(id: string): Observable<any> {
    return this.api.get<any>(`recruiters/band/${id}`);
  }

  getRecruiterComments(id: string): Observable<any[]> {
    return this.api.get<any[]>(`recruiters/${id}/comments`);
  }

  getRecruiterRatings(id: string): Observable<any[]> {
    return this.api.get<any[]>(`recruiters/${id}/ratings`);
  }
}