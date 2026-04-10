import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MotivoSalidaResponse, CrearMotivoRequest, ActualizarMotivoRequest } from '../models/motivo-salida.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MotivoSalidaService {

  private readonly apiUrl = `${environment.apiUrl}/api/motivossalida`;

  constructor(private http: HttpClient) {}

  listar(): Observable<MotivoSalidaResponse[]> {
    return this.http.get<ApiResponse<MotivoSalidaResponse[]>>(this.apiUrl).pipe(
      map(r => r.data)
    );
  }

  obtener(id: number): Observable<MotivoSalidaResponse> {
    return this.http.get<ApiResponse<MotivoSalidaResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(r => r.data)
    );
  }

  crear(request: CrearMotivoRequest): Observable<MotivoSalidaResponse> {
    return this.http.post<ApiResponse<MotivoSalidaResponse>>(this.apiUrl, request).pipe(
      map(r => r.data)
    );
  }

  actualizar(id: number, request: ActualizarMotivoRequest): Observable<MotivoSalidaResponse> {
    return this.http.put<ApiResponse<MotivoSalidaResponse>>(`${this.apiUrl}/${id}`, request).pipe(
      map(r => r.data)
    );
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }

  activar(id: number): Observable<void> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/activar`, {}).pipe(
      map(() => void 0)
    );
  }
}
