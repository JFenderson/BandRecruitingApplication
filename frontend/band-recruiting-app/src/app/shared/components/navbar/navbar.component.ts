import { Component } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: false
})
export class NavbarComponent {
  router: any;
  
logout() {
  this.tokenService.clearToken();
  this.router.navigate(['/login']);
}
  constructor(private tokenService: TokenService) {}

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