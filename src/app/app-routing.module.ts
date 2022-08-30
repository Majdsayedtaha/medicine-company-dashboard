import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'users-management',
        loadChildren: () =>
          import('./views/users-management/users-management.module').then(
            (m) => m.UsersManagementModule
          ),
      },
      {
        path: 'ads',
        loadChildren: () =>
          import('./views/ads/ads.module').then((m) => m.AdsModule),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./views/events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'articles',
        loadChildren: () =>
          import('./views/articles/articles.module').then(
            (m) => m.ArticlesModule
          ),
      },
      {
        path: 'medicines',
        loadChildren: () =>
          import('./views/medicines/medicines.module').then(
            (m) => m.MedicinesModule
          ),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('./views/offers/offers.module').then((m) => m.OffersModule),
      },
      {
        path: 'company-details',
        loadChildren: () =>
          import('./views/company-details/company-details.module').then(
            (m) => m.CompanyDetailsModule
          ),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
