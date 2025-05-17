import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class RecruiterService {
  constructor(private api: ApiService) {}

  getAllRecruiters() {
    return this.api.get<any[]>('api/Recruiter');
  }

  getRecruiterById(id: string) {
    return this.api.get<any>(`api/Recruiter/${id}`);
  }

  updateRecruiter(id: string, data: any) {
    return this.api.put<any>(`api/Recruiter/${id}`, data);
  }

  deleteRecruiter(id: string) {
    return this.api.delete<any>(`api/Recruiter/${id}`);
  }

  createRecruiter(data: any) {
    return this.api.post<any>('api/Recruiter', data);
  }

  getRecruiterBand(id: string) {
    return this.api.get<any>(`api/Recruiter/band/${id}`);
  }

  getRecruiterComments(id: string) {
    return this.api.get<any[]>(`api/Recruiter/${id}/comments`);
  }

  getRecruiterRatings(id: string) {
    return this.api.get<any[]>(`api/Recruiter/${id}/ratings`);
  }
}