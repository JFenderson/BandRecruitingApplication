import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentDTO } from '../../core/models/student.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
   standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class StudentProfileComponent implements OnInit {
  studentForm!: FormGroup;
  originalStudent!: StudentDTO;
  editMode: { [key: string]: boolean } = {};
  studentId!: string;
  showEditModal = false;
  previewImageUrl: string | null = null;
  readonly editableFields: (keyof StudentDTO)[] = [
  'firstName', 'lastName', 'email', 'phone', 'instrument', 'highSchool', 'videoUrl'];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
      private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;
    this.studentService.getStudentById(this.studentId).subscribe(student => {
      console.log(student);
      this.originalStudent = student;
      this.studentForm = this.fb.group({
        firstName: [student.firstName],
        lastName: [student.lastName],
        email: [student.email],
        phone: [student.phone],
        instrument: [student.instrument],
        highSchool: [student.highSchool],
        videoUrl: [student.videoUrl]
      });
    });
  }

  toggleEdit(field: string): void {
    this.editMode[field] = !this.editMode[field];
  }

openEditModal(): void {
  this.showEditModal = true;
  this.previewImageUrl = this.originalStudent.profilePicture ?? null;

  this.studentForm.setValue({
    firstName: this.originalStudent.firstName,
    lastName: this.originalStudent.lastName,
    email: this.originalStudent.email,
    phone: this.originalStudent.phone,
    instrument: this.originalStudent.instrument,
    highSchool: this.originalStudent.highSchool,
    videoUrl: this.originalStudent.videoUrl
  });
}

closeEditModal(): void {
  this.showEditModal = false;
  this.studentForm.reset();
}

onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

saveChanges(): void {
  const changes: any = {};
  for (const key of this.editableFields) {
    const current = this.studentForm.get(key)?.value;
    const original = this.originalStudent[key];
    if (current !== original) {
      changes[key] = current;
    }
  }

  if (this.previewImageUrl && this.previewImageUrl !== this.originalStudent.profilePicture) {
    changes['profilePicture'] = this.previewImageUrl;
  }

  if (Object.keys(changes).length === 0) {
    this.toast.info('No changes to save');
    return;
  }

  this.studentService.updateStudent(this.studentId, changes).subscribe(() => {
    Object.assign(this.originalStudent, changes);
    this.toast.success('Profile updated');
    this.closeEditModal();
  });
}

//   saveChanges(): void {
//   if (!this.studentForm) return;

//   const changes: any = {};

//   Object.keys(this.studentForm.controls).forEach(key => {
//     const current = this.studentForm.get(key)?.value;
//     const original = this.originalStudent[key as keyof StudentDTO];

//     if (current !== original) {
//       changes[key] = current;
//     }
//   });

//   if (Object.keys(changes).length > 0) {
//     this.studentService.updateStudent(this.studentId, changes).subscribe(() => {
//       this.toast.success('Changes saved successfully');
//       Object.assign(this.originalStudent, changes);
//       this.editMode = {};
//     });
//   } else {
//     this.toast.info('No changes to save');
//   }
// }

}
