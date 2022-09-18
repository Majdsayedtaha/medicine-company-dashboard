import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDetailsRoutingModule } from './company-details-routing.module';
import { CompanyDetailsComponent } from './company-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxFileDropModule } from 'ngx-file-drop';


@NgModule({
  declarations: [
    CompanyDetailsComponent
  ],
  imports: [
    CommonModule,
    CompanyDetailsRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxFileDropModule,
  ]
})
export class CompanyDetailsModule { }
