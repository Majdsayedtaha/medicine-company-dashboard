import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { SharedModule } from 'src/app/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GridModule, ProgressModule, BadgeModule, ListGroupModule, WidgetModule } from '@coreui/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    WidgetModule
  ]
})
export class EventsModule { }
