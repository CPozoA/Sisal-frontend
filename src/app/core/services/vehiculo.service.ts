import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { VehiculoResponse, CrearVehiculoRequest, ActualizarVehiculoRequest } from '../models/vehiculo.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehiculoService {

  private readonly apiUrl = `${environment.apiUrl}/api/vehiculos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<VehiculoResponse[]> {
    return this.http.get<ApiResponse<VehiculoResponse[]>>(this.apiUrl).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<VehiculoResponse> {
    return this.http.get<ApiResponse<VehiculoResponse>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }

  crear(request: CrearVehiculoRequest): Observable<VehiculoResponse> {
    return this.http.post<ApiResponse<VehiculoResponse>>(this.apiUrl, request).pipe(map(r => r.data));
  }

  actualizar(id: number, request: ActualizarVehiculoRequest): Observable<VehiculoResponse> {
    return this.http.put<ApiResponse<VehiculoResponse>>(`${this.apiUrl}/${id}`, request).pipe(map(r => r.data));
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(map(() => void 0));
  }

  activar(id: number): Observable<void> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/activar`, {}).pipe(map(() => void 0));
  }
}
