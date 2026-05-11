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
    path: 'cultivos/editar/:id',
    loadComponent: () =>
      import('./features/cultivos/components/editar-cultivo/editar-cultivo.component').then((m) => m.EditarCultivoComponent),
  },
  {
    path: 'agricultores',
    loadComponent: () =>
      import('./features/agricultores/components/gestion-agricultores/gestion-agricultores.component').then((m) => m.GestionAgricultoresComponent),
  },
  {
    path: 'agricultores/crear',
    loadComponent: () =>
      import('./features/agricultores/components/crear-agricultor/crear-agricultor.component').then((m) => m.CrearAgricultorComponent),
  },
  {
    path: 'agricultores/editar/:id',
    loadComponent: () =>
      import('./features/agricultores/components/editar-agricultor/editar-agricultor.component').then((m) => m.EditarAgricultorComponent),
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
