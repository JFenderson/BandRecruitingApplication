import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  @Input() group?: FormGroup;          // optional input from parent
  @Output() submitted = new EventEmitter<void>();

  form!: FormGroup;                    // exposed for specs

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.group ?? this.fb.group({
      instrument: [''],
      highSchool: [''],
      graduationYear: [''],
      bandId: [''],
    });
  }

  submit(): void {
    this.submitted.emit();
  }
}
