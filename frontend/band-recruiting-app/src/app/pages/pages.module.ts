import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UserCreateComponent } from "./user-create/user-create.component";
import { UserListComponent } from "./user-list/user-list.component";
import { RecruiterFormComponent } from "./user-create/recruiter-form/recruiter-form.component";
import { StudentFormComponent } from "./user-create/student-form/student-form.component";
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    UserCreateComponent,
    UserListComponent,
    RecruiterFormComponent,
    StudentFormComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
],
exports: [HomeComponent]
})
export class PagesModule { }
