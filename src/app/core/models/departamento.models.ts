export interface DepartamentoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface CrearDepartamentoRequest {
  nombre: string;
  descripcion: string;
}

export interface ActualizarDepartamentoRequest {
  nombre: string;
  descripcion: string;
}
