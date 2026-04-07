import { Injectable } from '@angular/core';
import { EmpleadoResponse } from '../models/empleado.models';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private readonly TOKEN_KEY = 'sisal_token';
  private readonly REFRESH_TOKEN_KEY = 'sisal_refresh_token';
  private readonly USER_KEY = 'sisal_user';

  // ── Token ──
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ── Refresh Token ──
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // ── Usuario ──
  setUser(user: EmpleadoResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): EmpleadoResponse | null {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data) as EmpleadoResponse;
    } catch {
      return null;
    }
  }

  // ── Limpiar todo (logout) ──
  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}