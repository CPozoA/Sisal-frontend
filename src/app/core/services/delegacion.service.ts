import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DelegacionResponse, CrearDelegacionRequest, DepartamentoConJefeResponse } from '../models/delegacion.models';
import { EmpleadoResponse } from '../models/empleado.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DelegacionService {

  private readonly apiUrl = `${environment.apiUrl}/api/delegaciones`;
  private readonly depUrl = `${environment.apiUrl}/api/departamentos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<DelegacionResponse[]> {
    return this.http.get<ApiResponse<DelegacionResponse[]>>(this.apiUrl).pipe(map(r => r.data));
  }

  activas(): Observable<DelegacionResponse[]> {
    return this.http.get<ApiResponse<DelegacionResponse[]>>(`${this.apiUrl}/activas`).pipe(map(r => r.data));
  }

  crear(request: CrearDelegacionRequest): Observable<DelegacionResponse> {
    return this.http.post<ApiResponse<DelegacionResponse>>(this.apiUrl, request).pipe(map(r => r.data));
  }

  revocar(id: number): Observable<void> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/revocar`, {}).pipe(map(() => void 0));
  }

  departamentosConJefes(): Observable<DepartamentoConJefeResponse[]> {
    return this.http.get<ApiResponse<DepartamentoConJefeResponse[]>>(`${this.depUrl}/con-jefes`).pipe(map(r => r.data));
  }

  empleadosDepartamento(depId: number): Observable<EmpleadoResponse[]> {
    return this.http.get<ApiResponse<EmpleadoResponse[]>>(`${this.depUrl}/${depId}/empleados`).pipe(map(r => r.data));
  }
}
