export interface DepartamentoResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CrearDepartamentoRequest {
  nombre: string;
}

export interface ActualizarDepartamentoRequest {
  nombre: string;
}