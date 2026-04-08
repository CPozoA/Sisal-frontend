import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const cambioClaveGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.requiereCambioClave()) {
    router.navigate(['/cambiar-clave']);
    return false;
  }

  return true;
};
