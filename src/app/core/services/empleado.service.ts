import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EmpleadoResponse, CrearEmpleadoRequest, ActualizarEmpleadoRequest } from '../models/empleado.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {

  private readonly apiUrl = `${environment.apiUrl}/api/empleados`;

  constructor(private http: HttpClient) {}

  listar(): Observable<EmpleadoResponse[]> {
    return this.http.get<ApiResponse<EmpleadoResponse[]>>(this.apiUrl).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<EmpleadoResponse> {
    return this.http.get<ApiResponse<EmpleadoResponse>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }

  miPerfil(): Observable<EmpleadoResponse> {
    return this.http.get<ApiResponse<EmpleadoResponse>>(`${this.apiUrl}/me`).pipe(map(r => r.data));
  }

  subordinados(id: number): Observable<EmpleadoResponse[]> {
    return this.http.get<ApiResponse<EmpleadoResponse[]>>(`${this.apiUrl}/${id}/subordinados`).pipe(map(r => r.data));
  }

  crear(request: CrearEmpleadoRequest): Observable<EmpleadoResponse> {
    return this.http.post<ApiResponse<EmpleadoResponse>>(this.apiUrl, request).pipe(map(r => r.data));
  }

  actualizar(request: ActualizarEmpleadoRequest): Observable<EmpleadoResponse> {
    return this.http.put<ApiResponse<EmpleadoResponse>>(this.apiUrl, request).pipe(map(r => r.data));
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(map(() => void 0));
  }

  activar(id: number): Observable<void> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/activar`, {}).pipe(map(() => void 0));
  }

  resetearClave(empleadoId: number): Observable<void> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/resetear-clave`, { empleadoId }).pipe(map(() => void 0));
  }
}
