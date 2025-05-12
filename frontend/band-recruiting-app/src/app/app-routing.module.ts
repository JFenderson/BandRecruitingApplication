import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
// import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
   {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: 'login' }, // Fallback
{ path: 'student/profile', component: StudentProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
