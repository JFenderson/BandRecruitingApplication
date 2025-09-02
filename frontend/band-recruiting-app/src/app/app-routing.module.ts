import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RecruiterLayoutComponent } from './layouts/recruiter-layout/recruiter-layout.component';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';

import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { AdminUserProfileComponent } from './admin/admin-user-profile/admin-user-profile.component';

import { RecruiterDashboardComponent } from './recruiter/recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterProfileComponent } from './recruiter/recruiter-profile/recruiter-profile.component';

import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';

import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [
  // Public
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Profiles (require auth; multiple roles can view)
  { path: 'student-profile/:id', component: StudentProfileComponent, canActivate: [AuthGuard] },
  { path: 'recruiter-profile/:id', component: RecruiterProfileComponent, canActivate: [AuthGuard] },

  // Bands (standalone lazy; protected)
  {
    path: 'bands',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./band/bands-browse/bands-browse.component').then(m => m.BandsBrowseComponent),
    title: 'Browse Bands'
  },
  {
    path: 'bands/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./band/band-profile/band-profile.component').then(m => m.BandProfileComponent),
    title: 'Band Profile'
  },

  // Admin area
  {
    path: 'admin-dashboard',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', component: AdminDashboardComponent, title: 'Admin Dashboard' },
      { path: 'all-users', component: UserListComponent, title: 'All Users' },
      { path: 'create-user', component: UserCreateComponent, title: 'Create User' },
      { path: 'admin-profile', component: UserCreateComponent, title: 'Admin Profile' }, // adjust if needed
      { path: 'users/:id', component: AdminUserProfileComponent, title: 'User Profile' }
    ]
  },

  // Recruiter area
  {
    path: 'recruiter-dashboard',
    component: RecruiterLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Recruiter'] },
    children: [
      { path: '', component: RecruiterDashboardComponent, title: 'Recruiter Dashboard' }
    ]
  },

  // Student area
  {
    path: 'student-dashboard',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] },
    children: [
      { path: '', component: StudentDashboardComponent, title: 'Student Dashboard' },

      // Student sub-pages (lazy standalone components you already have)
      {
        path: 'videos',
        loadComponent: () =>
          import('./student/components/video-list/video-list.component').then(m => m.VideoListComponent),
        title: 'My Videos'
      },
      {
        path: 'upload-video',
        loadComponent: () =>
          import('./student/components/video-uploader/video-uploader.component').then(m => m.VideoUploaderComponent),
        title: 'Upload Video'
      },
      {
        path: 'offers',
        loadComponent: () =>
          import('./student/components/offer-list/offer-list.component').then(m => m.OfferListComponent),
        title: 'My Offers'
      },
      {
        path: 'interests',
        loadComponent: () =>
          import('./student/components/interest-list/interest-list.component').then(m => m.InterestListComponent),
        title: 'My Interests'
      },
      {
        path: 'comments',
        loadComponent: () =>
          import('./student/components/comment-list/comment-list.component').then(m => m.CommentListComponent),
        title: 'Comments'
      }
    ]
  },

  // Utility
  { path: 'unauthorized', component: UnauthorizedComponent },

  // 404 - keep this as the only wildcard and ensure it is last
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Not Found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
