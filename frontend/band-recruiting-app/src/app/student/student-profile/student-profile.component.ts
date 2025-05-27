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
  readonly editableFields: (keyof StudentDTO)[] = [
  'firstName', 'lastName', 'email', 'phone', 'instrument', 'highSchool', 'videoUrl'
];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
      private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;
    this.studentService.getStudentById(this.studentId).subscribe(student => {
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

  saveChanges(): void {
  if (!this.studentForm) return;

  const changes: any = {};

  Object.keys(this.studentForm.controls).forEach(key => {
    const current = this.studentForm.get(key)?.value;
    const original = this.originalStudent[key as keyof StudentDTO];

    if (current !== original) {
      changes[key] = current;
    }
  });

  if (Object.keys(changes).length > 0) {
    this.studentService.updateStudent(this.studentId, changes).subscribe(() => {
      this.toast.success('Changes saved successfully');
      Object.assign(this.originalStudent, changes);
      this.editMode = {};
    });
  } else {
    this.toast.info('No changes to save');
  }
}

}
