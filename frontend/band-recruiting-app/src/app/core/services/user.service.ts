import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  getAll(): Observable<UserDTO[]> {
    return this.api.get<UserDTO[]>('Admin/all-users');
  }
  

  getById(id: string): Observable<UserDTO> {
    return this.api.get<UserDTO>(`users/${id}`);
  }

  create(user: CreateUserDTO): Observable<UserDTO> {
    return this.api.post<UserDTO>('users', user);
  }

  update(id: string, user: UpdateUserDTO): Observable<UserDTO> {
    return this.api.put<UserDTO>(`users/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`users/${id}`);
  }
}
