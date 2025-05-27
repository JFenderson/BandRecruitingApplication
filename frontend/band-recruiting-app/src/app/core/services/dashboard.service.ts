import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from "./api.service";
import { DashboardSummary } from '../models/dashboard.model';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>(`Admin/dashboard-summary`);
  }
}
