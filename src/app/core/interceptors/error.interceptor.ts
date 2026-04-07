import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {

      switch (error.status) {
        case 401:
          auth.logoutLocal();
          router.navigate(['/login']);
          toastr.warning('Tu sesión ha expirado. Inicia sesión nuevamente.', 'Sesión expirada');
          break;

        case 403:
          toastr.error('No tienes permisos para realizar esta acción.', 'Acceso denegado');
          break;

        case 404:
          toastr.error('El recurso solicitado no fue encontrado.', 'No encontrado');
          break;

        case 400:
          // Errores de validación del backend
          const mensaje = error.error?.message || error.error?.title || 'Datos inválidos.';
          toastr.error(mensaje, 'Error de validación');
          break;

        case 0:
          toastr.error('No se pudo conectar con el servidor. Verifica tu conexión.', 'Sin conexión');
          break;

        default:
          if (error.status >= 500) {
            toastr.error('Ocurrió un error en el servidor. Intenta más tarde.', 'Error del servidor');
          }
          break;
      }

      return throwError(() => error);
    })
  );
};