export interface DashboardModule {
  title: string;
  description: string;
  icon: string;
  route?: string;
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    title: 'Cultivos',
    description: 'Gestiona tus cultivos activos.',
    icon: 'leaf',
    route: '/cultivos',
  },
  {
    title: 'Tareas',
    description: 'Asigna y completa tareas.',
    icon: 'reader-outline',
    route: '/tareas',
  },
  {
    title: 'Inventario',
    description: 'Controla tus insumos.',
    icon: 'file-tray-full',
    route: '/insumos',
  },
  {
    title: 'Agricultores',
    description: 'Administra tu personal.',
    icon: 'people',
    route: '/agricultores',
  },
  {
    title: 'Productos',
    description: 'Gestiona la cosecha lista.',
    icon: 'basket',
    route: '/productos',
  },
  {
    title: 'Ventas',
    description: 'Registra y consulta ventas activas.',
    icon: 'cash-outline',
    route: '/ventas',
  },
];
