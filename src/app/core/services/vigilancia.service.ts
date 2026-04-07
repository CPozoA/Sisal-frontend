import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermisoResponse } from '../models/permiso.models';
import { RegistrarSalidaRequest, RegistrarRetornoRequest } from '../models/vigilancia.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VigilanciaService {
  private readonly apiUrl = `${environment.apiUrl}/api/vigilancia`;

  constructor(private http: HttpClient) {}

  permisosDelDia(): Observable<PermisoResponse[]> { return null!; }
  enCurso(): Observable<PermisoResponse[]> { return null!; }
  registrarSalida(request: RegistrarSalidaRequest): Observable<void> { return null!; }
  registrarRetorno(request: RegistrarRetornoRequest): Observable<void> { return null!; }
}