export interface VehiculoResponse {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  observacion: string | null;
  activo: boolean;
}

export interface CrearVehiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  observacion?: string;
}

export interface ActualizarVehiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  observacion?: string;
}