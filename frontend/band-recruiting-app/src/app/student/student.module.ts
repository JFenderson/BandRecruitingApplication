import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [StudentProfileComponent]
})
export class StudentModule { }
