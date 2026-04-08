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
  tipo: string;
  aprobado: boolean;
  comentario: string | null;
  fechaAprobacion: string;
  nombreAprobador: string;
}

export interface RegistroVigilanciaResponse {
  id: number;
  horaSalida: string | null;
  horaRetorno: string | null;
  nombreVigilanteSalida: string | null;
  nombreVigilanteRetorno: string | null;
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