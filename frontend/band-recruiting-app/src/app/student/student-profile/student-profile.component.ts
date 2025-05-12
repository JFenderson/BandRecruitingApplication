import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss',
  standalone: false
})
export class StudentProfileComponent implements OnInit {
  setupForm!: FormGroup;
  videoFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.setupForm = this.fb.group({
      instrument: ['', Validators.required],
      highSchool: ['', Validators.required],
      videoTitle: ['', Validators.required],
      videoDescription: ['']
    });
  }

  onFileSelected(event: any) {
    this.videoFile = event.target.files[0];
  }

  onSubmit() {
    if (this.setupForm.invalid || !this.videoFile) {
      alert('Fill all fields and select a video.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.setupForm.get('videoTitle')?.value);
    formData.append('description', this.setupForm.get('videoDescription')?.value);
    formData.append('file', this.videoFile);

    // 1. Save extra profile info
    this.http.put(`${environment.apiUrl}/students/profile`, {
      instrument: this.setupForm.get('instrument')?.value,
      highSchool: this.setupForm.get('highSchool')?.value
    }).subscribe({
      next: () => {
        // 2. Upload video after profile is updated
        this.http.post(`${environment.apiUrl}/students/videos`, formData)
          .subscribe({
            next: () => this.router.navigate(['/student/dashboard']),
            error: err => console.error(err)
          });
      },
      error: err => console.error(err)
    });
  }
}
