import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.scss'],
   standalone: true,
  imports: [CommonModule, RouterModule],
})
export class RecruiterProfileComponent {

}
