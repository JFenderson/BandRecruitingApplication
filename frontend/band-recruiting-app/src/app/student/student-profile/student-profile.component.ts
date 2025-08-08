// src/app/student/student-profile/student-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { CommonModule }      from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService }    from '../../core/services/student.service';
import { StudentDTO }        from '../../core/models/student.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  getProfileLink(student: any) {
    throw new Error('Method not implemented.');
  }
  student(student: any) {
    throw new Error('Method not implemented.');
  }
  studentId!: string;               // <-- now a string
  originalStudent!: StudentDTO;
  studentForm!: FormGroup;
  showEditModal = false;
  previewImageUrl?: string;
  editableFields = ['firstName','lastName','email','phone','instrument','highSchool'];

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;  // no Number(...)
    this.studentService.getStudentById(this.studentId)
      .subscribe(student => {
        this.originalStudent = student;
        this.studentForm = this.fb.group({
          firstName:  [student.firstName, Validators.required],
          lastName:   [student.lastName,  Validators.required],
          email:      [student.email,     [Validators.required, Validators.email]],
          phone:      [student.phone,     Validators.required],
          instrument: [student.instrument,Validators.required],
          highSchool: [student.highSchool,Validators.required]
        });
      });
  }

  openEditModal(): void { this.showEditModal = true; }
  closeEditModal(): void {
    this.showEditModal = false;
    this.previewImageUrl = undefined;
  }

  onImageSelected(evt: Event): void {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (file) {
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
    const data = { ...this.studentForm.value } as any;
    if (this.previewImageUrl) data.profilePicture = this.previewImageUrl;
 this.studentService.updateStudent(this.studentId, data)
  .subscribe(updated => {
    // `updated` is now a StudentDTO, so `profilePicture` & `studentId` are present
    this.originalStudent = updated;
    this.closeEditModal();
  });
  }
}
