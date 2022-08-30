import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import { UsersManagementComponent } from './users-management.component';
import { SharedModule } from '../../shared.module';


@NgModule({
  declarations: [UsersManagementComponent],
  imports: [CommonModule, UsersManagementRoutingModule, SharedModule],
})
export class UsersManagementModule { }
