import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class BandService {
  constructor(private api: ApiService) {}

  getAllBands() {
    return this.api.get<any[]>('api/Bands');
  }

  getBandById(id: string) {
    return this.api.get<any>(`api/Bands/${id}`);
  }

  createBand(data: any) {
    return this.api.post<any>('api/Bands', data);
  }

  updateBand(id: string, data: any) {
    return this.api.put<any>(`api/Bands/${id}`, data);
  }

  deleteBand(id: string) {
    return this.api.delete<any>(`api/Bands/${id}`);
  }

  getInterestedStudents(bandId: string) {
    return this.api.get<any>(`api/Bands/${bandId}/interestedStudents`);
  }
}
