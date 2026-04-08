import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cambiar-clave',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cambiar-clave.html',
  styleUrl: './cambiar-clave.scss',
})
export class CambiarClave {

  claveActual = '';
  claveNueva = '';
  confirmarClaveNueva = '';

  ocultarActual = true;
  ocultarNueva = true;
  ocultarConfirmar = true;

  cargando = signal(false);

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  // ── Validaciones en tiempo real ──
  get tieneMinimo8(): boolean {
    return this.claveNueva.length >= 8;
  }

  get tieneMayuscula(): boolean {
    return /[A-Z]/.test(this.claveNueva);
  }

  get tieneNumero(): boolean {
    return /[0-9]/.test(this.claveNueva);
  }

  get tieneEspecial(): boolean {
    return /[!@#$%^&*]/.test(this.claveNueva);
  }

  get clavesCoinciden(): boolean {
    return this.claveNueva === this.confirmarClaveNueva;
  }

  get claveNuevaValida(): boolean {
    return this.tieneMinimo8 && this.tieneMayuscula && this.tieneNumero && this.tieneEspecial;
  }

  get formularioValido(): boolean {
    return this.claveActual.length > 0
      && this.claveNuevaValida
      && this.clavesCoinciden;
  }

  // ── Acción ──
  cambiarClave(): void {
    if (!this.formularioValido) {
      this.toastr.warning('Completa todos los campos correctamente.', 'Formulario incompleto');
      return;
    }

    this.cargando.set(true);

    this.authService.cambiarClave({
      claveActual: this.claveActual,
      claveNueva: this.claveNueva,
      confirmarClaveNueva: this.confirmarClaveNueva,
    }).subscribe({
      next: () => {
        this.cargando.set(false);

        // Actualizar el flag en el storage
        const user = this.storage.getUser();
        if (user) {
          user.requiereCambioClave = false;
          this.storage.setUser(user);
        }

        this.toastr.success('Tu contraseña ha sido actualizada.', '¡Listo!');
        this.router.navigate([this.authService.getRutaInicio()]);
      },
      error: (err) => {
        this.cargando.set(false);

        if (err.status === 400) {
          this.toastr.error(
            err.error?.message || 'La contraseña actual es incorrecta.',
            'Error'
          );
        }
      },
    });
  }
}
