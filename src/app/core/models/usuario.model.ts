export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
  ultimoAcceso: string | null;
}

export interface UpdateUsuarioRolRequest {
  rol: 'Administrador' | 'Lider';
}

export interface UpdateUsuarioEstadoRequest {
  estado: 'Activo' | 'Inactivo';
}
