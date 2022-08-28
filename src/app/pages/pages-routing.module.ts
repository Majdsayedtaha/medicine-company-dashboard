import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
// import { Page404Component } from './page404/page404.component';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'users-management',
        loadChildren: () => import('./users-management/users-management.module').then(m => m.UsersManagementModule),
      },
      {
        path: 'medicines',
        loadChildren: () => import('./medicines/medicines.module').then(m => m.MedicinesModule),
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then(m => m.OffersModule),
      },
      {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'ads',
        loadChildren: () => import('./ads/ads.module').then(m => m.AdsModule),
      },

      {
        path: 'articles',
        loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule),
      },
      {
        path: 'company-details',
        loadChildren: () => import('./company-details/company-details.module').then(m => m.CompanyDetailsModule),
      },
      {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full',
      },
      // {
      //   path: '**',
      //   component: Page404Component,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
