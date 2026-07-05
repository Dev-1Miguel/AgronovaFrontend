export interface DashboardModule {
  title: string;
  description: string;
  icon: string;
  route?: string;
  adminOnly?: boolean;
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    title: 'Cultivos',
    description: 'Gestiona tus cultivos activos.',
    icon: 'leaf',
    route: '/cultivos',
  },
  {
    title: 'Administracion',
    description: 'Centraliza usuarios y parametros del sistema.',
    icon: 'settings-outline',
    route: '/administracion',
    adminOnly: true,
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
];
