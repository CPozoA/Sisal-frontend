export interface PermisoResponse {
  id: number;
  empleadoId: number;
  nombreEmpleado: string;
  nombreMotivo: string;
  motivoRequiereAnexo: boolean;
  fechaSolicitud: string;
  observacion: string | null;
  estado: EstadoPermiso;
  fechaCaducidad: string;
  aprobaciones: AprobacionResponse[];
  registroVigilancia: RegistroVigilanciaResponse | null;
  anexos: AnexoResponse[];
  placaVehiculo: string | null;
  descripcionVehiculo: string | null;
}

export interface CrearPermisoRequest {
  motivoId: number;
  observacion?: string;
  vehiculoId?: number;
}

export interface AprobarRechazarRequest {
  permisoId: number;
  comentario?: string;
}

export interface AprobacionResponse {
  id: number;
  tipoAprobador: string;
  nombreAprobador: string;
  decision: string;
  comentario: string | null;
  fechaDecision: string;
}

export interface RegistroVigilanciaResponse {
  id: number;
  nombreVigilante: string | null;
  horaSalida: string | null;
  horaRetorno: string | null;
}

export interface AnexoResponse {
  id: number;
  nombreArchivo: string;
  tipoArchivo: string;
  url: string;
}

export type EstadoPermiso =
  | 'Pendiente'
  | 'AprobadoJefe'
  | 'AprobadoRRHH'
  | 'EnCurso'
  | 'Cerrado'
  | 'Rechazado'
  | 'Caducado';
