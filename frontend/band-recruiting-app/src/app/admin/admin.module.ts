import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./dashboard/admin-dashboard.component";


@NgModule({
    declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
]
})
export class AdminModule { }
