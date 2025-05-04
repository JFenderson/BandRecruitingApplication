import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // { path: 'dashboard', component: DashboardComponent } ← you’ll add this later
    { path: '', redirectTo: 'login', pathMatch: 'full' }
  ];
  
