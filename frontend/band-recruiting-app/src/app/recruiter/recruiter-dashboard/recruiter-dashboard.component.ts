import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { SummaryMetrics, ActivityItem } from '../../core/models/dashboard.model';
import { StudentDTO } from '../../core/models/student.model';

@Component({
  standalone: true,
  selector: 'app-recruiter-dashboard',
  imports: [CommonModule, RouterModule],
  template: `
  <div class="p-4 space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-2xl shadow p-4 bg-white">
        <div class="text-sm text-gray-500">Total Students</div>
        <div class="text-2xl font-semibold">{{summary()?.totalStudents ?? 0}}</div>
      </div>
      <div class="rounded-2xl shadow p-4 bg-white">
        <div class="text-sm text-gray-500">Interested In Your Band</div>
        <div class="text-2xl font-semibold">{{summary()?.interestedInBand ?? 0}}</div>
      </div>
      <div class="rounded-2xl shadow p-4 bg-white">
        <div class="text-sm text-gray-500">Offers Sent</div>
        <div class="text-2xl font-semibold">{{summary()?.offersSent ?? 0}}</div>
      </div>
      <div class="rounded-2xl shadow p-4 bg-white">
        <div class="text-sm text-gray-500">Offers Accepted</div>
        <div class="text-2xl font-semibold">{{summary()?.offersAccepted ?? 0}}</div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="rounded-2xl shadow bg-white">
      <div class="px-4 py-3 border-b font-medium">Recent Activity</div>
      <ul class="divide-y">
        <li *ngFor="let a of activity()" class="px-4 py-3 flex items-center justify-between">
          <div class="text-sm">
            <span class="font-medium">{{a.studentName}}</span>
            <span class="text-gray-600" *ngIf="a.type==='video_upload'"> uploaded a new video.</span>
            <span class="text-gray-600" *ngIf="a.type==='student_interest'"> is interested in your band.</span>
            <span class="text-gray-600" *ngIf="a.type==='rating_left'"> received a new rating.</span>
            <span class="text-gray-600" *ngIf="a.type==='offer_status'"> offer status changed.</span>
            <span class="text-gray-400 ml-2">{{a.timestamp | date:'short'}}</span>
          </div>
          <div class="flex gap-2">
            <a [routerLink]="['/recruiter/students', a.studentId]" class="text-blue-600 hover:underline text-sm">View Profile</a>
          </div>
        </li>
        <li *ngIf="!activity().length" class="px-4 py-6 text-sm text-gray-500">No recent activity.</li>
      </ul>
    </div>

    <!-- Student Directory -->
    <div class="rounded-2xl shadow bg-white">
      <div class="px-4 py-3 border-b flex items-center gap-2">
        <input [(ngModel)]="search" placeholder="Search students" class="border rounded-lg px-3 py-2 w-full max-w-sm" />
        <select [(ngModel)]="instrument" class="border rounded-lg px-3 py-2">
          <option value="">All Instruments</option>
          <option *ngFor="let i of instruments" [value]="i">{{i}}</option>
        </select>
        <button (click)="loadStudents()" class="ml-auto px-4 py-2 rounded-xl bg-blue-600 text-white">Apply</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-2">Name</th>
              <th class="text-left px-4 py-2">Instrument</th>
              <th class="text-left px-4 py-2">Avg Rating</th>
              <th class="text-left px-4 py-2">Interested</th>
              <th class="text-left px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of students()" class="border-t">
              <td class="px-4 py-2">{{s.firstName}} {{s.lastName}}</td>
              <td class="px-4 py-2">{{s.instrument || '-'}}</td>
              <td class="px-4 py-2">{{s.averageRating?.toFixed(1) || '—'}}</td>
              <td class="px-4 py-2">
                <span class="px-2 py-1 rounded-full text-xs" [class.bg-green-100]="s.isInterestedInMyBand" [class.text-green-700]="s.isInterestedInMyBand" [class.bg-gray-100]="!s.isInterestedInMyBand" [class.text-gray-600]="!s.isInterestedInMyBand">
                  {{ s.isInterestedInMyBand ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-4 py-2 text-right">
                <a [routerLink]="['/recruiter/students', s.studentId]" class="text-blue-600 hover:underline">Profile</a>
              </td>
            </tr>
            <tr *ngIf="!students().length">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">No students found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
  styles: []
})


export class RecruiterDashboardComponent implements OnInit {
private recruiterSvc = inject(RecruiterService);
private studentSvc = inject(StudentService);
private auth = inject(AuthService);


summary = signal<SummaryMetrics | null>(null);
activity = signal<ActivityItem[]>([]);
students = signal<StudentDTO[]>([]);


search = '';
instrument = '';
instruments = ['Trumpet', 'Clarinet', 'Saxophone', 'Trombone', 'Tuba', 'Percussion']; // replace with API if available


ngOnInit() {
this.recruiterSvc.getSummary().subscribe(v => this.summary.set(v));
this.recruiterSvc.getActivityFeed().subscribe(v => this.activity.set(v));
this.loadStudents();
}


loadStudents() {
const bandId = this.auth.currentUser()?.bandId;
this.studentSvc.getStudents({ search: this.search || undefined, instrument: this.instrument || undefined, interestedInBandId: bandId }).subscribe(r => {
const items = (r as any).items ?? (r as any); // support both paged and plain lists
this.students.set(items);
});
}
}