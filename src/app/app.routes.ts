import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'cultivos',
    loadComponent: () =>
      import('./features/cultivos/components/gestion-cultivos/gestion-cultivo.component').then((m) => m.CultivosPage),
  },
  {
    path: 'cultivos/crear',
    loadComponent: () =>
      import('./features/cultivos/components/crear-cultivo/crear-cultivo.component').then((m) => m.CrearCultivoComponent),
  },
  {
    path: 'home',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
