import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import { UsersManagementComponent } from './users-management.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, UsersManagementRoutingModule],
  declarations: [UsersManagementComponent],
})
export class UsersManagementModule {}
