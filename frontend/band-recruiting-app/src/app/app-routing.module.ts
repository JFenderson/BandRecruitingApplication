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
import { RoleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: 'login' }, // Fallback
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'student/profile', component: StudentProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { roles: ['Admin'] }
  },
  { path: 'recruiter-dashboard', component: RecruiterDashboardComponent, canActivate: [RoleGuard],data: { roles: ['Recruiter'] }},
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [RoleGuard],data: { roles: ['Student'] }},
  { path: 'unauthorized', component: UnauthorizedComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
