import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicinesRoutingModule } from './medicines-routing.module';
import { MedicinesComponent } from './medicines.component';

@NgModule({
  declarations: [MedicinesComponent],
  imports: [CommonModule, MedicinesRoutingModule],
})
export class MedicinesModule {}
