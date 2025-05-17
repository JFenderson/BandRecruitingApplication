import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./dashboard/admin-dashboard.component";


@NgModule({
    declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
]
})
export class AdminModule { }
