import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DepartamentoResponse, CrearDepartamentoRequest, ActualizarDepartamentoRequest } from '../models/departamento.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {

  private readonly apiUrl = `${environment.apiUrl}/api/departamentos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<DepartamentoResponse[]> {
    return this.http.get<ApiResponse<DepartamentoResponse[]>>(this.apiUrl).pipe(
      map(r => r.data)
    );
  }

  obtener(id: number): Observable<DepartamentoResponse> {
    return this.http.get<ApiResponse<DepartamentoResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(r => r.data)
    );
  }

  crear(request: CrearDepartamentoRequest): Observable<DepartamentoResponse> {
    return this.http.post<ApiResponse<DepartamentoResponse>>(this.apiUrl, request).pipe(
      map(r => r.data)
    );
  }

  actualizar(id: number, request: ActualizarDepartamentoRequest): Observable<DepartamentoResponse> {
    return this.http.put<ApiResponse<DepartamentoResponse>>(`${this.apiUrl}/${id}`, request).pipe(
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
