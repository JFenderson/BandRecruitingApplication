// admin/services/admin-user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface UserDTO {
  id: string;
  email: string;
  userType: 'Student' | 'Recruiter';
  firstName: string;
  lastName: string;
  phone: string;
  instrument?: string;
  highSchool?: string;
  graduationYear?: number;
  profilePicture?: string;
  bandId?: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  instrument?: string;
  highSchool?: string;
  graduationYear?: number;
  profilePicture?: string;
  bandId?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private baseUrl = `${environment.apiUrl}/Admin/Users`;

  constructor(private http: HttpClient) {}

  getUser(userId: string) {
    return this.http.get<UserDTO>(`${this.baseUrl}/${userId}`);
  }

  
  updateUser(userId: string, dto: UpdateUserDTO) {
    return this.http.put(`${this.baseUrl}/${userId}`, dto);
  }
}
