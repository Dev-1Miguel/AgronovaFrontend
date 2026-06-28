export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface ForgotPasswordRequest {
  correo: string;
}

export interface ResetPasswordRequest {
  token: string;
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

export interface AuthMessageResponse {
  message: string;
}
