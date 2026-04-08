import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  documento = '';
  password = '';
  ocultarPassword = true;
  cargando = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  soloNumeros(event: KeyboardEvent): void {
    const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'];
    if (permitidas.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  filtrarPegado(event: ClipboardEvent): void {
    event.preventDefault();
    const texto = event.clipboardData?.getData('text') || '';
    const soloDigitos = texto.replace(/\D/g, '').substring(0, 8);
    this.documento = soloDigitos;
  }

  iniciarSesion(): void {
    // Validación básica
    if (!this.documento || !this.password) {
      this.toastr.warning('Ingresa tu documento y contraseña.', 'Campos requeridos');
      return;
    }

    if (!/^\d{8}$/.test(this.documento)) {
      this.toastr.warning('El documento debe tener exactamente 8 dígitos.', 'Documento inválido');
      return;
    }

    this.cargando.set(true);

    this.authService.login({ documento: this.documento, password: this.password }).subscribe({
      next: (response) => {
        this.cargando.set(false);

        if (response.requiereCambioClave) {
          this.router.navigate(['/cambiar-clave']);
          return;
        }

        this.toastr.success(`Bienvenido, ${response.empleado?.nombres || 'Usuario'}`, '¡Hola!');
        this.router.navigate([this.authService.getRutaInicio()]);
      },
      error: (err) => {
        this.cargando.set(false);
        const mensaje = err.error?.message || 'Documento o contraseña incorrectos.';
        this.toastr.error(mensaje, 'Error de autenticación');
      },
    });
  }
}
