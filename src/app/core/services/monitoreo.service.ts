import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EmpleadoAfueraResponse } from '../models/monitoreo.models';
import { ApiResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MonitoreoService {

  private readonly apiUrl = `${environment.apiUrl}/api/monitoreo`;

  constructor(private http: HttpClient) {}

  empleadosAfuera(): Observable<EmpleadoAfueraResponse[]> {
    return this.http.get<ApiResponse<EmpleadoAfueraResponse[]>>(`${this.apiUrl}/empleados-afuera`).pipe(map(r => r.data));
  }
}
