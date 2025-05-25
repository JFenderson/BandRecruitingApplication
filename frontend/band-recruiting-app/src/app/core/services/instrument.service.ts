import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Instrument } from '../models/instrument.model';
import { StudentService } from './student.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InstrumentService {
    private baseUrl = `${environment.apiUrl}/account`;
  constructor(private api: ApiService) {}

  getAllInstruments(): Observable<Instrument[]> {
    return this.api.get<Instrument[]>('Instruments');
  }

  getInstrumentById(id: number): Observable<Instrument> {
    return this.api.get<Instrument>(`Instruments/${id}`);
  }

  createInstrument(data: Instrument): Observable<Instrument> {
    return this.api.post<Instrument>('Instruments', data);
  }

  updateInstrument(id: number, data: Instrument): Observable<Instrument> {
    return this.api.put<Instrument>(`Instruments/${id}`, data);
  }

  deleteInstrument(id: number): Observable<void> {
    return this.api.delete<void>(`Instruments/${id}`);
  }
}
