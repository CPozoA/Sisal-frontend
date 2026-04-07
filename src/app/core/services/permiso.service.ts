import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermisoResponse, CrearPermisoRequest, AprobarRechazarRequest } from '../models/permiso.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermisoService {
  private readonly apiUrl = `${environment.apiUrl}/api/permisos`;

  constructor(private http: HttpClient) {}

  misPermisos(): Observable<PermisoResponse[]> { return null!; }
  obtener(id: number): Observable<PermisoResponse> { return null!; }
  todos(): Observable<PermisoResponse[]> { return null!; }
  pendientesParaAprobar(): Observable<PermisoResponse[]> { return null!; }
  enCurso(): Observable<PermisoResponse[]> { return null!; }
  historial(filtros?: any): Observable<PermisoResponse[]> { return null!; }
  crear(request: CrearPermisoRequest): Observable<PermisoResponse> { return null!; }
  aprobarJefe(request: AprobarRechazarRequest): Observable<void> { return null!; }
  rechazarJefe(request: AprobarRechazarRequest): Observable<void> { return null!; }
  aprobarRRHH(request: AprobarRechazarRequest): Observable<void> { return null!; }
  rechazarRRHH(request: AprobarRechazarRequest): Observable<void> { return null!; }
  subirAnexo(permisoId: number, archivo: File): Observable<void> { return null!; }
}