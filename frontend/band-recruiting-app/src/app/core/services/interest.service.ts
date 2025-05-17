import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { InterestDTO } from '../models/interest.model';

@Injectable({ providedIn: 'root' })
export class InterestService {
  constructor(private api: ApiService) {}

  getByStudent(studentId: string): Observable<InterestDTO[]> {
    return this.api.get<InterestDTO[]>(`students/${studentId}/interests`);
  }

  add(studentId: string, interest: InterestDTO): Observable<InterestDTO> {
    return this.api.post<InterestDTO>(`students/${studentId}/interests`, interest);
  }
}
