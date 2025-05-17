import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  standalone: false
})
export class StudentProfileComponent implements OnInit {
  studentForm!: FormGroup;
  originalStudent: any;
  editMode: { [key: string]: boolean } = {};
  studentId!: string;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute
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
      const original = this.originalStudent[key];
      if (current !== original) {
        changes[key] = current;
      }
    });

    if (Object.keys(changes).length > 0) {
      this.studentService.updateStudent(this.studentId, changes).subscribe(() => {
        alert('Changes saved');
        Object.assign(this.originalStudent, changes);
        this.editMode = {};
      });
    } else {
      alert('No changes to save');
    }
  }
}
