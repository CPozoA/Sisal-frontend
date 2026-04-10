import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  PermisoResponse,
  CrearPermisoRequest,
  AprobarRechazarRequest,
} from '../models/permiso.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermisoService {
  private readonly apiUrl = `${environment.apiUrl}/api/permisos`;

  constructor(private http: HttpClient) {}

  misPermisos(): Observable<PermisoResponse[]> {
    return this.http
      .get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/mis-permisos`)
      .pipe(map((r) => r.data));
  }

  obtener(id: number): Observable<PermisoResponse> {
    return this.http
      .get<ApiResponse<PermisoResponse>>(`${this.apiUrl}/${id}`)
      .pipe(map((r) => r.data));
  }

  todos(): Observable<PermisoResponse[]> {
    return this.http
      .get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/todos`)
      .pipe(map((r) => r.data));
  }

  pendientesParaAprobar(): Observable<PermisoResponse[]> {
    return this.http
      .get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/pendientes-para-aprobar`)
      .pipe(map((r) => r.data));
  }

  enCurso(): Observable<PermisoResponse[]> {
    return this.http
      .get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/en-curso`)
      .pipe(map((r) => r.data));
  }

  historial(filtros?: {
    empleadoId?: number;
    desde?: string;
    hasta?: string;
    estado?: string;
  }): Observable<PermisoResponse[]> {
    let params = new HttpParams();
    if (filtros?.empleadoId) params = params.set('empleadoId', filtros.empleadoId);
    if (filtros?.desde) params = params.set('desde', filtros.desde);
    if (filtros?.hasta) params = params.set('hasta', filtros.hasta);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    return this.http
      .get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/historial`, { params })
      .pipe(map((r) => r.data));
  }

  crear(request: CrearPermisoRequest): Observable<PermisoResponse> {
    return this.http
      .post<ApiResponse<PermisoResponse>>(this.apiUrl, request)
      .pipe(map((r) => r.data));
  }

  aprobarJefe(request: AprobarRechazarRequest): Observable<void> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/aprobar-jefe`, request)
      .pipe(map(() => void 0));
  }

  rechazarJefe(request: AprobarRechazarRequest): Observable<void> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/rechazar-jefe`, request)
      .pipe(map(() => void 0));
  }

  aprobarRRHH(request: AprobarRechazarRequest): Observable<void> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/aprobar-rrhh`, request)
      .pipe(map(() => void 0));
  }

  rechazarRRHH(request: AprobarRechazarRequest): Observable<void> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/rechazar-rrhh`, request)
      .pipe(map(() => void 0));
  }

  subirAnexo(permisoId: number, archivo: File): Observable<void> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/${permisoId}/anexos`, formData)
      .pipe(map(() => void 0));
  }

  historialEquipo(filtros?: {
    desde?: string;
    hasta?: string;
    estado?: string;
  }): Observable<PermisoResponse[]> {
    let params = new HttpParams();
    if (filtros?.desde) params = params.set('desde', filtros.desde);
    if (filtros?.hasta) params = params.set('hasta', filtros.hasta);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    return this.http
      .get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/historial-equipo`, { params })
      .pipe(map((r) => r.data));
  }
}
