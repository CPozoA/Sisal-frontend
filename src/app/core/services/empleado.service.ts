import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoResponse, CrearEmpleadoRequest, ActualizarEmpleadoRequest } from '../models/empleado.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly apiUrl = `${environment.apiUrl}/api/empleados`;

  constructor(private http: HttpClient) {}

  listar(): Observable<EmpleadoResponse[]> { return null!; }
  obtener(id: number): Observable<EmpleadoResponse> { return null!; }
  miPerfil(): Observable<EmpleadoResponse> { return null!; }
  subordinados(id: number): Observable<EmpleadoResponse[]> { return null!; }
  crear(request: CrearEmpleadoRequest): Observable<EmpleadoResponse> { return null!; }
  actualizar(request: ActualizarEmpleadoRequest): Observable<EmpleadoResponse> { return null!; }
  desactivar(id: number): Observable<void> { return null!; }
  activar(id: number): Observable<void> { return null!; }
  resetearClave(id: number): Observable<void> { return null!; }
}