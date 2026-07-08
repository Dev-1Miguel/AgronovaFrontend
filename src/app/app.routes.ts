import { Routes } from '@angular/router';
import { adminRoleGuard } from './core/guards/admin-role.guard';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/components/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () =>
      import('./features/auth/components/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'administracion',
    canActivate: [authGuard, adminRoleGuard],
    loadComponent: () =>
      import('./features/administracion/components/administracion/administracion.component').then((m) => m.AdministracionComponent),
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, adminRoleGuard],
    loadComponent: () =>
      import('./features/usuarios/components/gestion-usuarios/gestion-usuarios.component').then((m) => m.GestionUsuariosComponent),
  },
  {
    path: 'cultivos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cultivos/components/gestion-cultivos/gestion-cultivo.component').then((m) => m.CultivosPage),
  },
  {
    path: 'cultivos/crear',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cultivos/components/crear-cultivo/crear-cultivo.component').then((m) => m.CrearCultivoComponent),
  },
  {
    path: 'cultivos/editar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cultivos/components/editar-cultivo/editar-cultivo.component').then((m) => m.EditarCultivoComponent),
  },
  {
    path: 'parametros',
    canActivate: [authGuard, adminRoleGuard],
    loadComponent: () =>
      import('./features/catalogos/components/parametros/parametros.component').then((m) => m.ParametrosComponent),
  },
  {
    path: 'categorias-cultivo',
    canActivate: [authGuard, adminRoleGuard],
    loadComponent: () =>
      import('./features/catalogos/components/parametros/parametros.component').then((m) => m.ParametrosComponent),
  },
  {
    path: 'insumos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/insumos/components/gestion-insumos/gestion-insumos.component').then((m) => m.GestionInsumosComponent),
  },
  {
    path: 'insumos/crear',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/insumos/components/crear-insumo/crear-insumo.component').then((m) => m.CrearInsumoComponent),
  },
  {
    path: 'insumos/editar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/insumos/components/editar-insumo/editar-insumo.component').then((m) => m.EditarInsumoComponent),
  },
  {
    path: 'tareas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tareas/components/gestion-tareas/gestion-tareas.component').then((m) => m.GestionTareasComponent),
  },
  {
    path: 'tareas/crear',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tareas/components/crear-tarea/crear-tarea.component').then((m) => m.CrearTareaComponent),
  },
  {
    path: 'tareas/editar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tareas/components/editar-tarea/editar-tarea.component').then((m) => m.EditarTareaComponent),
  },
  {
    path: 'agricultores',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/agricultores/components/gestion-agricultores/gestion-agricultores.component').then((m) => m.GestionAgricultoresComponent),
  },
  {
    path: 'agricultores/crear',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/agricultores/components/crear-agricultor/crear-agricultor.component').then((m) => m.CrearAgricultorComponent),
  },
  {
    path: 'agricultores/editar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/agricultores/components/editar-agricultor/editar-agricultor.component').then((m) => m.EditarAgricultorComponent),
  },
  {
    path: 'home',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
