import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { DepartamentoService } from '../../../../core/services/departamento.service';
import { DepartamentoResponse } from '../../../../core/models/departamento.models';

@Component({
  selector: 'app-form-departamento',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './form-departamento.html',
  styleUrl: './form-departamento.scss',
})
export class FormDepartamento {

  nombre = '';
  descripcion = '';
  cargando = signal(false);
  esEdicion = false;
  departamentoId = 0;

  constructor(
    private dialogRef: MatDialogRef<FormDepartamento>,
    @Inject(MAT_DIALOG_DATA) public data: DepartamentoResponse | null,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService
  ) {
    if (data) {
      this.esEdicion = true;
      this.departamentoId = data.id;
      this.nombre = data.nombre;
      this.descripcion = data.descripcion || '';
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
    const payload = { nombre: this.nombre.trim(), descripcion: this.descripcion.trim() };

    if (this.esEdicion) {
      this.departamentoService.actualizar(this.departamentoId, payload).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Departamento actualizado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.cargando.set(false);
        },
      });
    } else {
      this.departamentoService.crear(payload).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Departamento creado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.cargando.set(false);
        },
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
