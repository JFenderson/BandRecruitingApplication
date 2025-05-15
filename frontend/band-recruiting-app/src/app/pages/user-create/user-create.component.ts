import { Component } from '@angular/core';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  standalone: false
})
export class UserCreateComponent {
  userType: 'Student' | 'Recruiter' = 'Student';

  onUserTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.userType = value as 'Student' | 'Recruiter';
  }
}
