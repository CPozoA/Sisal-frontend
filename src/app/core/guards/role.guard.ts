import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const rolesRequeridos: string[] = route.data?.['roles'] || [];

  // Si no se especificaron roles, dejar pasar
  if (rolesRequeridos.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene al menos uno de los roles requeridos
  const tieneRol = rolesRequeridos.some(role => auth.hasRole(role));

  if (tieneRol) {
    return true;
  }

  toastr.error('No tienes permisos para acceder a esta sección.', 'Acceso denegado');
  router.navigate([auth.getRutaInicio()]);
  return false;
};