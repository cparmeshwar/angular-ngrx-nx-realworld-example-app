import { Route } from '@angular/router';
import { authGuard } from './features/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-overview/dashboard-overview.component').then(
            (m) => m.DashboardOverviewComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/dashboard/dashboard-users/dashboard-users.component').then(
            (m) => m.DashboardUsersComponent,
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/dashboard/dashboard-analytics/dashboard-analytics.component').then(
            (m) => m.DashboardAnalyticsComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/dashboard/dashboard-settings/dashboard-settings.component').then(
            (m) => m.DashboardSettingsComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
