export interface EmpleadoResponse {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  documento: string;
  email: string;
  celular: string | null;
  nivelJerarquico: number;
  nombreJefe: string | null;
  nombreDepartamento: string;
  esVigilante: boolean;
  esRRHH: boolean;
  esAdmin: boolean;
  activo: boolean;
  requiereCambioClave: boolean;
}

export interface CrearEmpleadoRequest {
  nombres: string;
  apellidos: string;
  documento: string;
  email: string;
  celular?: string;
  departamentoId: number;
  nivelJerarquico: number;
  jefeId?: number;
  esVigilante: boolean;
  esRRHH: boolean;
  esAdmin: boolean;
}

export interface ActualizarEmpleadoRequest extends CrearEmpleadoRequest {
  id: number;
}