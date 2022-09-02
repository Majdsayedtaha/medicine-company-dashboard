import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './views/pages/login/login.component';
import { Page404Component } from './views/pages/page404/page404.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { AuthGuard } from '../app/services/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
      },

      {
        path: 'users-management',
        loadChildren: () =>
          import('./views/users-management/users-management.module').then(m => m.UsersManagementModule),
      },
      {
        path: 'ads',
        loadChildren: () => import('./views/ads/ads.module').then(m => m.AdsModule),
      },
      {
        path: 'events',
        loadChildren: () => import('./views/events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'articles',
        loadChildren: () => import('./views/articles/articles.module').then(m => m.ArticlesModule),
      },
      {
        path: 'medicines',
        loadChildren: () => import('./views/medicines/medicines.module').then(m => m.MedicinesModule),
      },
      {
        path: 'offers',
        loadChildren: () => import('./views/offers/offers.module').then(m => m.OffersModule),
      },
      {
        path: 'company-details',
        loadChildren: () => import('./views/company-details/company-details.module').then(m => m.CompanyDetailsModule),
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule),
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule),
      },
    ],
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: '404', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
