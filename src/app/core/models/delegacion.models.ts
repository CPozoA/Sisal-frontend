export interface DelegacionResponse {
  id: number;
  titularId: number;
  nombreTitular: string;
  delegadoId: number;
  nombreDelegado: string;
  fechaInicio: string;
  fechaFin: string | null;
  motivo: string;
  activa: boolean;
  fechaCreacion: string;
}

export interface CrearDelegacionRequest {
  titularId: number;
  delegadoId: number;
  fechaInicio: string;
  fechaFin?: string;
  motivo: string;
}

export interface DepartamentoConJefeResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  nombreJefe: string | null;
  nombreDelegado: string | null;
  cantidadEmpleados: number;
}