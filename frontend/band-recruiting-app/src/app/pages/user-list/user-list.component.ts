import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { UserDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: false
})
export class UserListComponent implements OnInit {
  users: UserDTO[] = [];
  isLoading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}
