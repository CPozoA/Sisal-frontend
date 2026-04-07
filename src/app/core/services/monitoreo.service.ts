import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private readonly apiUrl = `${environment.apiUrl}/api/monitoreo`;

  constructor(private http: HttpClient) {}

  empleadosAfuera(): Observable<any[]> { return null!; }
}