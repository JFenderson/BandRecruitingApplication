import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserDTO, CreateUserPayload, UpdateUserDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  getAll(): Observable<UserDTO[]> {
    console.log("Calling API to get all users");
    return this.api.get<UserDTO[]>('Admin/all-users');
  }
  

  getById(id: string): Observable<UserDTO> {
    return this.api.get<UserDTO>(`users/${id}`);
  }

  create(payload: CreateUserPayload): Observable<UserDTO> {
    return this.api.post<UserDTO>('users', payload);
  }

  update(id: string, user: UpdateUserDTO): Observable<UserDTO> {
    return this.api.put<UserDTO>(`users/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`users/${id}`);
  }
}
