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
    return this.api.get<UserDTO[]>('admin/all-users');
  }

  getById(id: string): Observable<UserDTO> {
    return this.api.get<UserDTO>(`admin/users/${id}`);
  }

  create(payload: CreateUserDTO): Observable<UserDTO> {
    return this.api.post<UserDTO>('admin/create-user', payload);
  }

  update(id: string, user: UpdateUserDTO): Observable<void> {
    return this.api.put<void>(`admin/users/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`admin/delete-user/${id}`);
  }
}