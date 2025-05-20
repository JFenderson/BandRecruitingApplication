import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.scss',
   standalone: true,
  imports: [CommonModule, RouterModule],
})
export class BandsComponent {

}
