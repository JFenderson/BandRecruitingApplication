import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Instrument } from '../models/instrument.model';
import { StudentService } from './student.service';

@Injectable({ providedIn: 'root' })
export class InstrumentService {
  constructor(private api: ApiService) {}

  getAllInstruments(): Observable<Instrument[]> {
    return this.api.get<Instrument[]>('api/Instruments');
  }

  getInstrumentById(id: number): Observable<Instrument> {
    return this.api.get<Instrument>(`api/Instruments/${id}`);
  }

  createInstrument(data: Instrument): Observable<Instrument> {
    return this.api.post<Instrument>('api/Instruments', data);
  }

  updateInstrument(id: number, data: Instrument): Observable<Instrument> {
    return this.api.put<Instrument>(`api/Instruments/${id}`, data);
  }

  deleteInstrument(id: number): Observable<void> {
    return this.api.delete<void>(`api/Instruments/${id}`);
  }
}
