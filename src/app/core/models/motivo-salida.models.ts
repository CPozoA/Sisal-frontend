export interface MotivoSalidaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  requiereAnexo: boolean;
  activo: boolean;
}

export interface CrearMotivoRequest {
  nombre: string;
  descripcion: string;
  requiereAnexo: boolean;
}

export interface ActualizarMotivoRequest {
  nombre: string;
  descripcion: string;
  requiereAnexo: boolean;
}