import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { UserDTO, UpdateUserDTO } from '../../core/models/user.model';
import { RatingService } from '../../core/services/rating.service';
import { RatingDTO } from '../../core/models/rating.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  studentId!: string;
  student: UserDTO | null = null;
  studentForm!: FormGroup;
  showEditModal = false;
  previewImageUrl?: string;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  ratings: RatingDTO[] = [];

  // Create a more descriptive field mapping
  editableFields = [
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'instrument', label: 'Instrument', type: 'text' },
    { key: 'highSchool', label: 'High School', type: 'text' }
  ];

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private ratingService: RatingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;
    this.loadStudent();
    this.loadRatings();
  }

  loadStudent(): void {
    this.isLoading = true;
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student: UserDTO) => {
        this.student = student;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load student profile';
        this.isLoading = false;
        console.error('Failed to load student:', err);
      }
    });
  }

  loadRatings(): void {
    this.ratingService.getRatingsByStudent(this.studentId).subscribe({
      next: (ratings: RatingDTO[]) => {
        this.ratings = ratings;
      },
      error: (err: any) => {
        console.error('Failed to load ratings:', err);
      }
    });
  }

  initializeForm(): void {
    if (!this.student) return;
    
    this.studentForm = this.fb.group({
      firstName: [this.student.firstName, Validators.required],
      lastName: [this.student.lastName, Validators.required],
      email: [this.student.email, [Validators.required, Validators.email]],
      phone: [this.student.phone, Validators.required],
      instrument: [this.student.instrument, Validators.required],
      highSchool: [this.student.highSchool, Validators.required],
      graduationYear: [this.student.graduationYear]
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.previewImageUrl = undefined;
    this.errorMessage = '';
    if (this.studentForm && this.student) {
      this.initializeForm();
    }
  }

  onImageSelected(evt: Event): void {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => this.previewImageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const updateData: UpdateUserDTO = {
      firstName: this.studentForm.value.firstName,
      lastName: this.studentForm.value.lastName,
      email: this.studentForm.value.email,
      phone: this.studentForm.value.phone,
      instrument: this.studentForm.value.instrument,
      highSchool: this.studentForm.value.highSchool,
      graduationYear: this.studentForm.value.graduationYear
    };

    if (this.previewImageUrl) {
      updateData.profilePicture = this.previewImageUrl;
    }

    this.studentService.updateStudent(this.studentId, updateData).subscribe({
      next: () => {
        if (this.student) {
          this.student = { ...this.student, ...updateData };
        }
        this.closeEditModal();
        this.isSaving = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to update profile';
        this.isSaving = false;
        console.error('Error updating profile:', error);
      }
    });
  }

  get averageRating(): number {
    if (!this.ratings.length) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + rating.score, 0);
    return sum / this.ratings.length;
  }
}