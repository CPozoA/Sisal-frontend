import { EmpleadoResponse } from './empleado.models';

export interface LoginRequest {
  cedula: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  empleado: EmpleadoResponse;
  requiereCambioClave: boolean;
}

export interface CambiarClaveRequest {
  claveActual: string;
  claveNueva: string;
  confirmarClave: string;
}