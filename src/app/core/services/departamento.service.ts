import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartamentoResponse, CrearDepartamentoRequest, ActualizarDepartamentoRequest } from '../models/departamento.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private readonly apiUrl = `${environment.apiUrl}/api/departamentos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<DepartamentoResponse[]> { return null!; }
  obtener(id: number): Observable<DepartamentoResponse> { return null!; }
  crear(request: CrearDepartamentoRequest): Observable<DepartamentoResponse> { return null!; }
  actualizar(id: number, request: ActualizarDepartamentoRequest): Observable<DepartamentoResponse> { return null!; }
  desactivar(id: number): Observable<void> { return null!; }
  activar(id: number): Observable<void> { return null!; }
}