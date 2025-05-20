import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recruiter-layout',
  templateUrl: './recruiter-layout.component.html',
  styleUrl: './recruiter-layout.component.scss',
   standalone: true,
  imports: [CommonModule, RouterModule],
})
export class RecruiterLayoutComponent {

}
