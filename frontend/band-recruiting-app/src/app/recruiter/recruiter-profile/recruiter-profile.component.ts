import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterService } from '../../core/services/recruiter.service';
import { OfferService } from '../../core/services/offer.service';
import { Recruiter } from '../../core/models/recruiter.model';

@Component({
  standalone: true,
  selector: 'app-recruiter-profile',
  imports: [CommonModule],
  template: `<div class="p-4 max-w-5xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl shadow p-6 flex gap-6 items-center">
      <div class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
        <img *ngIf="profile()?.pictureUrl" [src]="profile()?.pictureUrl" class="w-full h-full object-cover" />
      </div>
      <div>
        <div class="text-2xl font-semibold">{{profile()?.name}}</div>
        <div class="text-gray-600">{{profile()?.email}}</div>
        <div class="text-gray-600" *ngIf="profile()?.phone">{{profile()?.phone}}</div>
        <div class="mt-1"><span class="text-sm text-gray-500">Band</span> <span class="font-medium">{{profile()?.bandName}}</span></div>
      </div>
      <div class="ml-auto">
        <button class="px-4 py-2 rounded-xl bg-blue-600 text-white" (click)="toggleEdit()">{{editing() ? 'Cancel' : 'Edit Info'}}</button>
      </div>
    </div>

    <form *ngIf="editing()" class="bg-white rounded-2xl shadow p-6 space-y-4" (ngSubmit)="save()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block"> <span class="text-sm text-gray-600">Name</span>
          <input class="mt-1 border rounded-lg px-3 py-2 w-full" [(ngModel)]="editModel.name" name="name" />
        </label>
        <label class="block"> <span class="text-sm text-gray-600">Phone</span>
          <input class="mt-1 border rounded-lg px-3 py-2 w-full" [(ngModel)]="editModel.phone" name="phone" />
        </label>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="px-4 py-2 rounded-xl bg-green-600 text-white">Save</button>
      </div>
    </form>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="font-medium mb-2">Ratings Given</div>
        <ul class="space-y-2 text-sm text-gray-700 max-h-60 overflow-auto">
          <li *ngFor="let r of ratingsGiven">Student {{r.studentName}} • {{r.score}}★ • {{r.createdAt | date:'short'}} </li>
          <li *ngIf="!ratingsGiven.length" class="text-gray-500">No ratings yet.</li>
        </ul>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="font-medium mb-2">Comments Left</div>
        <ul class="space-y-2 text-sm text-gray-700 max-h-60 overflow-auto">
          <li *ngFor="let c of commentsLeft">On {{c.videoTitle}} • "{{c.text}}" • {{c.createdAt | date:'short'}}</li>
          <li *ngIf="!commentsLeft.length" class="text-gray-500">No comments yet.</li>
        </ul>
      </div>
      <div class="bg-white rounded-2xl shadow p-4">
        <div class="font-medium mb-2">Offers Sent</div>
        <ul class="space-y-2 text-sm text-gray-700 max-h-60 overflow-auto">
          <li *ngFor="let o of offersSent">{{o.studentName}} • ${{o.amount}} • {{o.status}}</li>
          <li *ngIf="!offersSent.length" class="text-gray-500">No offers yet.</li>
        </ul>
      </div>
    </div>
  </div>`
})
export class RecruiterProfileComponent implements OnInit {
  private recruiterSvc = inject(RecruiterService);
  profile = signal<Recruiter | null>(null);
  editing = signal(false);
  editModel: Partial<Recruiter> = {};

  // Replace with real shapes or fetch from backend endpoints
  ratingsGiven: Array<{ studentName: string; score: number; createdAt: string; }> = [];
  commentsLeft: Array<{ videoTitle: string; text: string; createdAt: string; }> = [];
  offersSent: Array<{ studentName: string; amount: number; status: string; }> = [];

  ngOnInit() {
    this.recruiterSvc.getMyProfile().subscribe(p => { this.profile.set(p); this.editModel = { name: p.name, phone: p.phone }; });
    // TODO wire ratings/comments via dedicated endpoints if available
  }

  toggleEdit() { this.editing.update(v => !v); }
  save() { this.recruiterSvc.updateMyProfile(this.editModel).subscribe(() => this.editing.set(false)); }
}