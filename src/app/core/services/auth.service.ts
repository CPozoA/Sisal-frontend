import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, AuthResponse, CambiarClaveRequest } from '../models/auth.models';
import { EmpleadoResponse } from '../models/empleado.models';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

interface JwtPayload {
  empleadoId: string;
  nivel: string;
  EsAdmin: string;
  EsRRHH: string;
  EsVigilante: string;
  exp: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  // ── Login ──
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.storage.setToken(response.token);
        this.storage.setRefreshToken(response.refreshToken);
        this.storage.setUser(response.empleado);
      })
    );
  }

  // ── Datos del usuario autenticado ──
  me(): Observable<EmpleadoResponse> {
    return this.http.get<EmpleadoResponse>(`${this.apiUrl}/me`);
  }

  // ── Renovar token ──
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storage.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        this.storage.setToken(response.token);
        this.storage.setRefreshToken(response.refreshToken);
        this.storage.setUser(response.empleado);
      })
    );
  }

  // ── Logout ──
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.storage.clear())
    );
  }

  // ── Cambiar clave ──
  cambiarClave(request: CambiarClaveRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/empleados/cambiar-clave`, request);
  }

  // ── ¿Está autenticado? ──
  isAuthenticated(): boolean {
    const token = this.storage.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch {
      return false;
    }
  }

  // ── Decodificar claims del JWT ──
  getTokenClaims(): JwtPayload | null {
    const token = this.storage.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  // ── Verificar roles ──
  hasRole(role: string): boolean {
    const claims = this.getTokenClaims();
    if (!claims) return false;

    const value = claims[role];
    return value === 'true' || value === 'True' || value === true;
  }

  // ── ¿Es jefe? (nivel 1-4) ──
  esJefe(): boolean {
    const claims = this.getTokenClaims();
    if (!claims) return false;

    const nivel = parseInt(claims['nivel'], 10);
    return nivel >= 1 && nivel <= 4;
  }

  // ── ¿Requiere cambio de clave? ──
  requiereCambioClave(): boolean {
    const user = this.storage.getUser();
    return user?.requiereCambioClave === true;
  }

  // ── Ruta de inicio según rol ──
  getRutaInicio(): string {
    if (this.hasRole('EsAdmin')) return '/admin/empleados';
    if (this.hasRole('EsRRHH')) return '/rrhh/pendientes';
    if (this.hasRole('EsVigilante')) return '/vigilancia/panel';
    if (this.esJefe()) return '/aprobaciones/pendientes';
    return '/permisos/mis-permisos';
  }

  // ── Forzar logout local (sin llamar al API) ──
  logoutLocal(): void {
    this.storage.clear();
  }
}