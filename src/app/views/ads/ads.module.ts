import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdsRoutingModule } from './ads-routing.module';
import { AdsComponent } from './ads.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GridModule, ProgressModule, BadgeModule, ListGroupModule, WidgetModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventsRoutingModule } from '../events/events-routing.module';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [AdsComponent],
  imports: [
    CommonModule,
    AdsRoutingModule,
    CommonModule,
    EventsRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    WidgetModule,
    SharedModule,
  ],
})
export class AdsModule {}
