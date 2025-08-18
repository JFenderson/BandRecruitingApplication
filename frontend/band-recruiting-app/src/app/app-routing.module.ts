import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
// import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';
import { RecruiterDashboardComponent } from './recruiter/recruiter-dashboard/recruiter-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { RecruiterProfileComponent } from './recruiter/recruiter-profile/recruiter-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RecruiterLayoutComponent } from './layouts/recruiter-layout/recruiter-layout.component';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { AdminUserProfileComponent } from './admin/admin-user-profile/admin-user-profile.component';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    { path: 'student-profile/:id', component: StudentProfileComponent },
  { path: 'recruiter-profile/:id', component: RecruiterProfileComponent },
    {
    path: 'admin-dashboard',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'all-users', component: UserListComponent },
      { path: 'create-user', component: UserCreateComponent },
      { path: 'admin-profile', component: UserCreateComponent },
      { path: 'users/:id', component: AdminUserProfileComponent }

    ]
  },
  {
    path: 'recruiter-dashboard',
    component: RecruiterLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Recruiter'] },
    children: [
      { path: '', component: RecruiterDashboardComponent }
    ]
  },
  {
    path: 'student-dashboard',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    children: [
      { path: '', component: StudentDashboardComponent }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
