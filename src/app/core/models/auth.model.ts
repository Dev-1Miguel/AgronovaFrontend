export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthenticatedUser {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}
