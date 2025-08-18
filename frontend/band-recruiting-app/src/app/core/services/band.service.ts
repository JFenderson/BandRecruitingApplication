import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class BandService {
    private baseUrl = `${environment.apiUrl}/Bands`;
  
  constructor(private api: ApiService) {}

  getAllBands() {
    return this.api.get<any[]>(`${this.baseUrl}`);
  }

  getBandById(id: string) {
    return this.api.get<any>(`${this.baseUrl}/${id}`);
  }

  createBand(data: any) {
    return this.api.post<any>(`${this.baseUrl}`, data);
  }

  updateBand(id: string, data: any) {
    return this.api.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteBand(id: string) {
    return this.api.delete<any>(`${this.baseUrl}/${id}`);
  }

  getInterestedStudents(bandId: string) {
    return this.api.get<any>(`${this.baseUrl}/${bandId}/interestedStudents`);
  }
}
