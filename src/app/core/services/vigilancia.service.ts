import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PermisoResponse } from '../models/permiso.models';
import { RegistrarSalidaRequest, RegistrarRetornoRequest } from '../models/vigilancia.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VigilanciaService {

  private readonly apiUrl = `${environment.apiUrl}/api/vigilancia`;

  constructor(private http: HttpClient) {}

  permisosDelDia(): Observable<PermisoResponse[]> {
    return this.http.get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/permisos-del-dia`).pipe(map(r => r.data));
  }

  enCurso(): Observable<PermisoResponse[]> {
    return this.http.get<ApiResponse<PermisoResponse[]>>(`${this.apiUrl}/en-curso`).pipe(map(r => r.data));
  }

  registrarSalida(request: RegistrarSalidaRequest): Observable<void> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/registrar-salida`, request).pipe(map(() => void 0));
  }

  registrarRetorno(request: RegistrarRetornoRequest): Observable<void> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/registrar-retorno`, request).pipe(map(() => void 0));
  }
}
