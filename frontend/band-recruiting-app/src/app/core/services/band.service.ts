import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class BandService {
  constructor(private api: ApiService) {}

  getAllBands() {
    return this.api.get<any[]>('Bands');
  }
  getBandById(id: string) {
    return this.api.get<any>(`Bands/${id}`);
  }
  createBand(data: any) {
    return this.api.post<any>('Bands', data);
  }
  updateBand(id: string, data: any) {
    return this.api.put<any>(`Bands/${id}`, data);
  }
  deleteBand(id: string) {
    return this.api.delete<any>(`Bands/${id}`);
  }
  getInterestedStudents(bandId: string) {
    return this.api.get<any>(`Bands/${bandId}/interestedStudents`);
  }
}