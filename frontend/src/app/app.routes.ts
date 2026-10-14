import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page')
        .then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
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
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/pages/tasks-page/tasks-page')
            .then((m) => m.TasksPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
