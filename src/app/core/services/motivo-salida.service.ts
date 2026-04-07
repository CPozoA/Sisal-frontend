import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotivoSalidaResponse, CrearMotivoRequest, ActualizarMotivoRequest } from '../models/motivo-salida.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MotivoSalidaService {
  private readonly apiUrl = `${environment.apiUrl}/api/motivossalida`;

  constructor(private http: HttpClient) {}

  listar(): Observable<MotivoSalidaResponse[]> { return null!; }
  obtener(id: number): Observable<MotivoSalidaResponse> { return null!; }
  crear(request: CrearMotivoRequest): Observable<MotivoSalidaResponse> { return null!; }
  actualizar(id: number, request: ActualizarMotivoRequest): Observable<MotivoSalidaResponse> { return null!; }
  desactivar(id: number): Observable<void> { return null!; }
  activar(id: number): Observable<void> { return null!; }
}