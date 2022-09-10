import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicinesRoutingModule } from './medicines-routing.module';
import { MedicinesComponent } from './medicines.component';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [MedicinesComponent],
  imports: [CommonModule, MedicinesRoutingModule, SharedModule],
})
export class MedicinesModule {}
