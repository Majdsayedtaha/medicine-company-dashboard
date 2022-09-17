import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { BadgeModule, GridModule, ListGroupModule, ProgressModule, WidgetModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventsRoutingModule } from '../events/events-routing.module';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [
    ArticlesComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    CommonModule,
    EventsRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    WidgetModule,
    SharedModule
  ]
})
export class ArticlesModule { }
