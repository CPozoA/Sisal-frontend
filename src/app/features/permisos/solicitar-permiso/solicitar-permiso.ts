import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from '../../../core/services/permiso.service';
import { MotivoSalidaService } from '../../../core/services/motivo-salida.service';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { MotivoSalidaResponse } from '../../../core/models/motivo-salida.models';
import { VehiculoResponse } from '../../../core/models/vehiculo.models';

@Component({
  selector: 'app-solicitar-permiso',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './solicitar-permiso.html',
  styleUrl: './solicitar-permiso.scss',
})
export class SolicitarPermiso implements OnInit {

  motivos: MotivoSalidaResponse[] = [];
  vehiculos: VehiculoResponse[] = [];

  motivoId: number | null = null;
  vehiculoId: number | null = null;
  observacion = '';
  archivo: File | null = null;
  nombreArchivo = '';
  tocadoMotivo = false;

  cargando = signal(false);
  cargandoDatos = signal(true);

  constructor(
    private permisoService: PermisoService,
    private motivoService: MotivoSalidaService,
    private vehiculoService: VehiculoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargandoDatos.set(true);
    let motivos = false;
    let vehiculos = false;

    this.motivoService.listar().subscribe({
      next: (data) => {
        this.motivos = data.filter(m => m.activo);
        motivos = true;
        if (vehiculos) this.cargandoDatos.set(false);
      },
      error: () => { motivos = true; if (vehiculos) this.cargandoDatos.set(false); },
    });

    this.vehiculoService.listar().subscribe({
      next: (data) => {
        this.vehiculos = data.filter(v => v.activo);
        vehiculos = true;
        if (motivos) this.cargandoDatos.set(false);
      },
      error: () => { vehiculos = true; if (motivos) this.cargandoDatos.set(false); },
    });
  }

  get motivoSeleccionado(): MotivoSalidaResponse | null {
    if (!this.motivoId) return null;
    return this.motivos.find(m => m.id === this.motivoId) || null;
  }

  get requiereAnexo(): boolean {
    return this.motivoSeleccionado?.requiereAnexo === true;
  }

  get formularioValido(): boolean {
    if (!this.motivoId) return false;
    if (this.requiereAnexo && !this.archivo) return false;
    return true;
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validarArchivo(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.validarArchivo(event.dataTransfer.files[0]);
    }
  }

  private validarArchivo(file: File): void {
    const extensiones = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!extensiones.includes(file.type)) {
      this.toastr.error('Solo se permiten archivos PDF, JPG o PNG.', 'Archivo no válido');
      return;
    }

    if (file.size > maxSize) {
      this.toastr.error('El archivo no debe superar 10 MB.', 'Archivo muy grande');
      return;
    }

    this.archivo = file;
    this.nombreArchivo = file.name;
  }

  quitarArchivo(): void {
    this.archivo = null;
    this.nombreArchivo = '';
  }

  formatearTamano(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  enviar(): void {
    if (!this.formularioValido) {
      this.toastr.warning('Completa los campos obligatorios.', 'Formulario incompleto');
      return;
    }

    this.cargando.set(true);

    this.permisoService.crear({
      motivoId: this.motivoId!,
      observacion: this.observacion.trim() || undefined,
      vehiculoId: this.vehiculoId || undefined,
    }).subscribe({
      next: (permiso) => {
        if (this.archivo && permiso.id) {
          this.permisoService.subirAnexo(permiso.id, this.archivo).subscribe({
            next: () => {
              this.cargando.set(false);
              this.toastr.success('Permiso solicitado con anexo adjunto.', '¡Solicitud enviada!');
              this.router.navigate(['/permisos/mis-permisos']);
            },
            error: () => {
              this.cargando.set(false);
              this.toastr.warning('Permiso creado pero hubo un error al subir el anexo.', 'Atención');
              this.router.navigate(['/permisos/mis-permisos']);
            },
          });
        } else {
          this.cargando.set(false);
          this.toastr.success('Tu permiso ha sido enviado para aprobación.', '¡Solicitud enviada!');
          this.router.navigate(['/permisos/mis-permisos']);
        }
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/permisos/mis-permisos']);
  }
}
