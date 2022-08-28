import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthPagesRoutingModule } from './auth-pages/auth-pages-routing.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    AuthPagesRoutingModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
