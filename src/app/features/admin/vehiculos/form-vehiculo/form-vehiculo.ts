import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { VehiculoService } from '../../../../core/services/vehiculo.service';
import { VehiculoResponse } from '../../../../core/models/vehiculo.models';

@Component({
  selector: 'app-form-vehiculo',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './form-vehiculo.html',
  styleUrl: './form-vehiculo.scss',
})
export class FormVehiculo {

  placa = '';
  marca = '';
  modelo = '';
  color = '';
  observacion = '';
  cargando = signal(false);
  esEdicion = false;
  vehiculoId = 0;

  constructor(
    private dialogRef: MatDialogRef<FormVehiculo>,
    @Inject(MAT_DIALOG_DATA) public data: VehiculoResponse | null,
    private vehiculoService: VehiculoService,
    private toastr: ToastrService
  ) {
    if (data) {
      this.esEdicion = true;
      this.vehiculoId = data.id;
      this.placa = data.placa;
      this.marca = data.marca;
      this.modelo = data.modelo;
      this.color = data.color;
      this.observacion = data.observacion || '';
    }
  }

  get formularioValido(): boolean {
    return this.placa.trim().length >= 3
      && this.marca.trim().length >= 2
      && this.modelo.trim().length >= 2
      && this.color.trim().length >= 2;
  }

  guardar(): void {
    if (!this.formularioValido) {
      this.toastr.warning('Completa los campos obligatorios.', 'Formulario incompleto');
      return;
    }

    this.cargando.set(true);
    const payload = {
      placa: this.placa.trim().toUpperCase(),
      marca: this.marca.trim(),
      modelo: this.modelo.trim(),
      color: this.color.trim(),
      observacion: this.observacion.trim() || undefined,
    };

    if (this.esEdicion) {
      this.vehiculoService.actualizar(this.vehiculoId, payload).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Vehículo actualizado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => this.cargando.set(false),
      });
    } else {
      this.vehiculoService.crear(payload).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Vehículo creado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  cancelar(): void { this.dialogRef.close(false); }
}
