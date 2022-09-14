import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicinesRoutingModule } from './medicines-routing.module';
import { MedicinesComponent } from './medicines.component';
import { SharedModule } from 'src/app/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
@NgModule({
  declarations: [MedicinesComponent],
  imports: [CommonModule, MedicinesRoutingModule, SharedModule,AgGridModule],
})
export class MedicinesModule {}
