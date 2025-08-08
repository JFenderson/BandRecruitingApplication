import { Component, OnInit }            from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule }                 from '@angular/common';
import { UserService }                  from '../../core/services/user.service';
import { UserDTO, UpdateUserDTO }       from '../../core/models/user.model';

@Component({
  selector:    'app-admin-user-profile',
  standalone:  true,
  imports: [
    CommonModule,          // *ngIf, *ngFor, etc.
    FormsModule,           // template-driven forms (if you have any)
    ReactiveFormsModule,   // reactive forms directives: formGroup, formControlName
    RouterModule
  ],
  templateUrl: './admin-user-profile.component.html',
  styleUrls:   ['./admin-user-profile.component.scss']
})
export class AdminUserProfileComponent implements OnInit {
  form!:     FormGroup;
  userId!:   string;
  user!:     UserDTO;

  constructor(
    private route:       ActivatedRoute,
    private fb:          FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // fetch the ID from the URL
    this.userId = this.route.snapshot.paramMap.get('id')!;
    // load the user data, then build the form
    this.userService.getById(this.userId).subscribe(u => {
      this.user = u;
      this.buildForm(u);
    });
  }

  private buildForm(u: UserDTO) {
    this.form = this.fb.group({
      email:          [u.email],
      password:       [''],           // leave blank on load
      firstName:      [u.firstName],
      lastName:       [u.lastName],
      phone:          [u.phone],
      instrument:     [u.instrument],
      highSchool:     [u.highSchool],
      graduationYear: [u.graduationYear],
      bandId:         [u.bandId],
    });
  }

  onSubmit(): void {
    const update: UpdateUserDTO = this.form.value;
    this.userService.update(this.userId, update).subscribe({
      next: ()  => alert('User updated!'),
      error: e => console.error('Update failed', e),
    });
  }
}
