import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recruiter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recruiter-form.component.html'
})
export class RecruiterFormComponent {
  @Input({ required: true }) group!: FormGroup;
bands: any;
}
