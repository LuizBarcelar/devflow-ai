
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout')
        .then((m) => m.DashboardLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-home/dashboard-home')
            .then((m) => m.DashboardHome),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/pages/projects-page/projects-page')
            .then((m) => m.ProjectsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
