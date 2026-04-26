export interface DashboardModule {
  title: string;
  description: string;
  icon: string;
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    title: 'Cultivos',
    description: 'Gestiona tus cultivos activos.',
    icon: 'leaf',
  },
  {
    title: 'Tareas',
    description: 'Asigna y completa tareas.',
    icon: 'reader-outline',
  },
  {
    title: 'Inventario',
    description: 'Controla tus insumos.',
    icon: 'file-tray-full',
  },
  {
    title: 'Agricultores',
    description: 'Administra tu personal.',
    icon: 'people',
  },
  {
    title: 'Productos',
    description: 'Gestiona la cosecha lista.',
    icon: 'basket',
  },
  {
    title: 'Mercado (Ventas)',
    description: 'Registra las ventas.',
    icon: 'storefront',
  },
];
