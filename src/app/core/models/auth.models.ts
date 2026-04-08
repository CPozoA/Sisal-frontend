import { EmpleadoResponse } from './empleado.models';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface LoginRequest {
  documento: string;
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
  confirmarClaveNueva: string;
}
