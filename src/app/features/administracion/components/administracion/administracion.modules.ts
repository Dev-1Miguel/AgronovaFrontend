import { DashboardModule } from '../../../../core/models/dashboard-module.model';

export const ADMINISTRATION_MODULES: DashboardModule[] = [
  {
    title: 'Usuarios',
    description: 'Consulta usuarios, cambia rol y activa o desactiva accesos.',
    icon: 'people',
    route: '/usuarios',
  },
  {
    title: 'Parametros',
    description: 'Administra categorias, tipos y ubicaciones del sistema.',
    icon: 'settings-outline',
    route: '/parametros',
  },
];
