import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffersRoutingModule } from './offers-routing.module';
import { OffersComponent } from './offers.component';
import { BadgeModule, GridModule, ListGroupModule, ProgressModule, SharedModule, WidgetModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [OffersComponent],
  imports: [
    CommonModule,
    OffersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    WidgetModule,
  ],
})
export class OffersModule {}
