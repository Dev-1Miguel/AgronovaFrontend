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
    path: 'categorias-cultivo',
    loadComponent: () =>
      import('./features/catalogos/components/gestion-categorias-cultivo/gestion-categorias-cultivo.component').then((m) => m.GestionCategoriasCultivoComponent),
  },
  {
    path: 'insumos',
    loadComponent: () =>
      import('./features/insumos/components/gestion-insumos/gestion-insumos.component').then((m) => m.GestionInsumosComponent),
  },
  {
    path: 'insumos/crear',
    loadComponent: () =>
      import('./features/insumos/components/crear-insumo/crear-insumo.component').then((m) => m.CrearInsumoComponent),
  },
  {
    path: 'insumos/editar/:id',
    loadComponent: () =>
      import('./features/insumos/components/editar-insumo/editar-insumo.component').then((m) => m.EditarInsumoComponent),
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./features/productos/components/gestion-productos/gestion-productos.component').then((m) => m.GestionProductosComponent),
  },
  {
    path: 'productos/crear',
    loadComponent: () =>
      import('./features/productos/components/crear-producto/crear-producto.component').then((m) => m.CrearProductoComponent),
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () =>
      import('./features/productos/components/editar-producto/editar-producto.component').then((m) => m.EditarProductoComponent),
  },
  {
    path: 'ventas',
    loadComponent: () =>
      import('./features/ventas/components/gestion-ventas/gestion-ventas.component').then((m) => m.GestionVentasComponent),
  },
  {
    path: 'ventas/crear',
    loadComponent: () =>
      import('./features/ventas/components/crear-venta/crear-venta.component').then((m) => m.CrearVentaComponent),
  },
  {
    path: 'tareas',
    loadComponent: () =>
      import('./features/tareas/components/gestion-tareas/gestion-tareas.component').then((m) => m.GestionTareasComponent),
  },
  {
    path: 'tareas/crear',
    loadComponent: () =>
      import('./features/tareas/components/crear-tarea/crear-tarea.component').then((m) => m.CrearTareaComponent),
  },
  {
    path: 'tareas/editar/:id',
    loadComponent: () =>
      import('./features/tareas/components/editar-tarea/editar-tarea.component').then((m) => m.EditarTareaComponent),
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
