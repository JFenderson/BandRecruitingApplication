import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recruiter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recruiter-form.component.html',
})
export class RecruiterFormComponent implements OnInit {
  @Input() group?: FormGroup;     // parent can pass a group
  @Output() submitted = new EventEmitter<void>();

  form!: FormGroup;
bands: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Only bandId for recruiters
    this.form = this.group ?? this.fb.group({
      bandId: [''],
    });
  }

  submit(): void {
    this.submitted.emit();
  }
}
