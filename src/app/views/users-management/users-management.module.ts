import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import { UsersManagementComponent } from './users-management.component';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';



@NgModule({
  declarations: [UsersManagementComponent],

  imports: [CommonModule, UsersManagementRoutingModule, SharedModule,FormsModule,    AgGridModule],
})
export class UsersManagementModule { }
