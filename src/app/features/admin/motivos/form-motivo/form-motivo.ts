import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MotivoSalidaService } from '../../../../core/services/motivo-salida.service';
import { MotivoSalidaResponse } from '../../../../core/models/motivo-salida.models';

@Component({
  selector: 'app-form-motivo',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './form-motivo.html',
  styleUrl: './form-motivo.scss',
})
export class FormMotivo {

  nombre = '';
  descripcion = '';
  requiereAnexo = false;
  cargando = signal(false);
  esEdicion = false;
  motivoId = 0;

  constructor(
    private dialogRef: MatDialogRef<FormMotivo>,
    @Inject(MAT_DIALOG_DATA) public data: MotivoSalidaResponse | null,
    private motivoService: MotivoSalidaService,
    private toastr: ToastrService
  ) {
    if (data) {
      this.esEdicion = true;
      this.motivoId = data.id;
      this.nombre = data.nombre;
      this.descripcion = data.descripcion || '';
      this.requiereAnexo = data.requiereAnexo;
    }
  }

  get formularioValido(): boolean {
    return this.nombre.trim().length >= 2;
  }

  guardar(): void {
    if (!this.formularioValido) {
      this.toastr.warning('El nombre debe tener al menos 2 caracteres.', 'Campo requerido');
      return;
    }

    this.cargando.set(true);
    const payload = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      requiereAnexo: this.requiereAnexo,
    };

    if (this.esEdicion) {
      this.motivoService.actualizar(this.motivoId, payload).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Motivo actualizado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => this.cargando.set(false),
      });
    } else {
      this.motivoService.crear(payload).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Motivo creado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
