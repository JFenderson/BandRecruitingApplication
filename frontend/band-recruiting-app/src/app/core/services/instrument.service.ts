import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstrumentService {
  private instruments: string[] = [
    'Flute', 'Clarinet', 'Saxophone', 'Trumpet', 'Trombone',
    'Mellophone', 'Baritone', 'Sousaphone', 'Snare Drum',
    'Bass Drum', 'Tenor Drum', 'Cymbals',
  ];

  getInstruments(): Observable<string[]> {
    return of(this.instruments);
  }
}
