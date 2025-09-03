// src/app/pages/band-profile/band-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BandService } from '../../core/services/band.service';
import { RecruiterService } from '../../core/services/recruiter.service';
import { StudentService } from '../../core/services/student.service';
import { TokenService } from '../../core/services/token.service';
import { BandDTO } from '../../core/models/band.model';
import { UserDTO } from '../../core/models/user.model';
import { UpdateInterestDTO } from '../../core/models/interest.model';

@Component({
  selector: 'app-band-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50" *ngIf="band">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center text-white">
            <!-- Band Logo/Icon -->
            <div class="w-32 h-32 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clip-rule="evenodd"></path>
              </svg>
            </div>
            
            <h1 class="text-5xl font-bold mb-2">{{ band.name }}</h1>
            <h2 class="text-2xl font-light mb-4">{{ band.schoolName }}</h2>
            <p class="text-xl opacity-90 mb-8">{{ band.city }}, {{ band.state }}</p>
            
            <div class="flex justify-center space-x-4 mb-8">
              <span class="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-lg">
                Division {{ band.division }}
              </span>
              <span class="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-lg">
                {{ band.conference }} Conference
              </span>
            </div>
            
            <div class="flex justify-center space-x-4">
              <button 
                *ngIf="!isInterested"
                (click)="expressInterest()"
                class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>Express Interest</span>
              </button>
              
              <button 
                *ngIf="isInterested"
                (click)="removeInterest()"
                class="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
                <span>Remove Interest</span>
              </button>
              
              <button class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Contact Recruiters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- About Section -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">About {{ band.name }}</h3>
              <div class="prose max-w-none text-gray-700">
                <p class="mb-4">
                  {{ band.name }} represents the proud musical tradition of {{ band.schoolName }}. 
                  As a Division {{ band.division }} program in the {{ band.conference }} Conference, 
                  we are committed to excellence in both musical performance and academic achievement.
                </p>
                <p class="mb-4">
                  Our marching band performs at all home football games and select away games, 
                  providing an electrifying atmosphere that energizes our team and fans. We also 
                  participate in various competitions and community events throughout the year.
                </p>
                <p>
                  We are always looking for dedicated musicians who share our passion for musical 
                  excellence and school spirit. Join us and become part of a legacy that spans decades 
                  of outstanding performances and unforgettable memories.
                </p>
              </div>
            </div>

            <!-- Program Highlights -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Program Highlights</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="flex items-start space-x-3">
                  <div class="bg-blue-100 p-2 rounded-lg">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Musical Excellence</h4>
                    <p class="text-gray-600 text-sm">Award-winning performances and competitive spirit</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <div class="bg-green-100 p-2 rounded-lg">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Scholarship Opportunities</h4>
                    <p class="text-gray-600 text-sm">Financial support for dedicated musicians</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <div class="bg-purple-100 p-2 rounded-lg">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Strong Community</h4>
                    <p class="text-gray-600 text-sm">Lifelong friendships and alumni network</p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <div class="bg-orange-100 p-2 rounded-lg">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Academic Support</h4>
                    <p class="text-gray-600 text-sm">Tutoring and mentorship programs</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent News & Events -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Recent News & Events</h3>
              <div class="space-y-4">
                <div *ngFor="let news of recentNews" class="border-l-4 border-blue-500 pl-4">
                  <h4 class="font-semibold text-gray-900">{{ news.title }}</h4>
                  <p class="text-gray-600 text-sm mb-2">{{ news.content }}</p>
                  <span class="text-xs text-gray-500">{{ news.date | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>

            <!-- Performance Schedule -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Upcoming Performances</h3>
              <div class="space-y-4">
                <div *ngFor="let event of upcomingEvents" 
                     class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ event.title }}</h4>
                    <p class="text-gray-600">{{ event.location }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ event.date | date:'mediumDate' }}</p>
                    <p class="text-sm text-gray-500">{{ event.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Quick Stats -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Band Statistics</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total Members</span>
                  <span class="font-semibold text-blue-600">{{ stats.totalMembers || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Founded</span>
                  <span class="font-semibold">{{ stats.founded || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Recruiters</span>
                  <span class="font-semibold text-purple-600">{{ recruiters.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Interested Students</span>
                  <span class="font-semibold text-green-600">{{ interestedStudents.length }}</span>
                </div>
              </div>
            </div>

            <!-- Recruiters -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Meet Our Recruiters</h3>
              <div class="space-y-4">
                <div *ngFor="let recruiter of recruiters" 
                     class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img [src]="recruiter.profilePicture || '/assets/default-avatar.png'" 
                       [alt]="recruiter.firstName + ' ' + recruiter.lastName"
                       class="w-10 h-10 rounded-full object-cover">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">
                      {{ recruiter.firstName }} {{ recruiter.lastName }}
                    </h4>
                    <p class="text-sm text-gray-600">Band Recruiter</p>
                  </div>
                  <button 
                    [routerLink]="['/recruiter-profile', recruiter.id]"
                    class="text-blue-600 hover:text-blue-800 text-sm">
                    View
                  </button>
                </div>
                
                <div *ngIf="recruiters.length === 0" class="text-center py-4">
                  <p class="text-gray-500">No recruiters listed</p>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-gray-600">Address</p>
                    <p class="font-medium">{{ band.city }}, {{ band.state }}</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-gray-600">Website</p>
                    <a href="#" class="font-medium text-blue-600 hover:text-blue-800">
                      Visit {{ band.schoolName }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
              <div class="space-y-3">
                <button 
                  *ngIf="!isInterested"
                  (click)="expressInterest()"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Express Interest
                </button>
                
                <button 
                  *ngIf="isInterested"
                  (click)="removeInterest()"
                  class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Remove Interest
                </button>
                
                <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Contact Recruiters
                </button>
                
                <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Share Band Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!band" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading band profile...</p>
      </div>
    </div>
  `
})
export class BandProfileComponent implements OnInit {
  bandId!: string;
  band!: BandDTO;
  recruiters: UserDTO[] = [];
  interestedStudents: UserDTO[] = [];
  isInterested = false;
  
  stats = {
    totalMembers: 150,
    founded: 1967
  };
  
  recentNews = [
    {
      title: "Outstanding Performance at Homecoming",
      content: "Our marching band delivered an spectacular halftime show that energized the crowd and helped lead our team to victory.",
      date: new Date(2024, 1, 15)
    },
    {
      title: "New Scholarship Opportunities Available",
      content: "We're excited to announce additional scholarship opportunities for incoming freshmen with strong musical backgrounds.",
      date: new Date(2024, 1, 10)
    },
    {
      title: "Competition Season Kicks Off",
      content: "Get ready for an exciting competition season as we prepare to showcase our talents across the region.",
      date: new Date(2024, 1, 5)
    }
  ];
  
  upcomingEvents = [
    {
      title: "Homecoming Game Performance",
      location: "University Stadium",
      date: new Date(2024, 2, 20),
      time: "7:00 PM"
    },
    {
      title: "Spring Concert",
      location: "Concert Hall",
      date: new Date(2024, 3, 15),
      time: "8:00 PM"
    },
    {
      title: "Community Parade",
      location: "Downtown",
      date: new Date(2024, 4, 1),
      time: "10:00 AM"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private bandService: BandService,
    private recruiterService: RecruiterService,
    private studentService: StudentService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.bandId = this.route.snapshot.paramMap.get('id')!;
    this.loadBandProfile();
    this.checkUserInterest();
  }

  loadBandProfile(): void {
    this.bandService.getBandById(this.bandId).subscribe({
      next: (band) => {
        this.band = band;
        this.loadRecruiters();
        this.loadInterestedStudents();
      },
      error: (error) => console.error('Error loading band profile:', error)
    });
  }

  loadRecruiters(): void {
    this.recruiterService.getAllRecruiters().subscribe({
      next: (recruiters) => {
        this.recruiters = recruiters.filter(r => r.bandId === this.bandId);
      },
      error: (error) => console.error('Error loading recruiters:', error)
    });
  }

  loadInterestedStudents(): void {
    this.bandService.getInterestedStudents(this.bandId).subscribe({
      next: (students) => {
        this.interestedStudents = students;
      },
      error: (error) => console.error('Error loading interested students:', error)
    });
  }

  checkUserInterest(): void {
    const currentUser = this.tokenService.decodeToken();
    if (currentUser?.nameid) {
      // Check if current user has expressed interest in this band
      // This would come from the user's interests
      this.isInterested = false; // Mock value
    }
  }

  expressInterest(): void {
  const currentUser = this.tokenService.decodeToken();
  if (!currentUser?.nameid || !this.bandId) return;

  const dto: UpdateInterestDTO = {
    bandId: this.bandId,
    isInterested: true
  };

  this.studentService.updateInterest(currentUser.nameid, this.bandId, dto).subscribe({
    next: () => {
      this.isInterested = true;
      this.loadInterestedStudents(); // Refresh list/count
    },
    error: (error: any) => console.error('Error expressing interest:', error)
  });
}

  removeInterest(): void {
    const currentUser = this.tokenService.decodeToken();
    if (!currentUser?.nameid) return;

    // Call API to remove interest
    // For now, just update the UI
    this.isInterested = false;
    this.loadInterestedStudents(); // Reload to show updated count
  }
}