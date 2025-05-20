import { Component } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
   standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  
logout() {
  this.tokenService.clearToken();
  this.router.navigate(['/login']);
}
  constructor(private tokenService: TokenService, private router: Router) {}

  get isAdmin() {
    return this.tokenService.isAdmin();
  }

  get isRecruiter() {
    return this.tokenService.isRecruiter();
  }

  get isStudent() {
    return this.tokenService.isStudent();
  }
}