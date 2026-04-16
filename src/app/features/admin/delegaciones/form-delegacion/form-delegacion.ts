import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { DelegacionService } from '../../../../core/services/delegacion.service';
import { DepartamentoConJefeResponse } from '../../../../core/models/delegacion.models';
import { EmpleadoResponse } from '../../../../core/models/empleado.models';

@Component({
  selector: 'app-form-delegacion',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './form-delegacion.html',
  styleUrl: './form-delegacion.scss',
})
export class FormDelegacion implements OnInit {

  departamentos: DepartamentoConJefeResponse[] = [];
  empleados: EmpleadoResponse[] = [];

  departamentoId: number | null = null;
  titularId: number | null = null;
  delegadoId: number | null = null;
  fechaInicio = '';
  fechaFin = '';
  motivo = '';

  cargando = signal(false);
  cargandoEmpleados = signal(false);

  constructor(
    private dialogRef: MatDialogRef<FormDelegacion>,
    private delegacionService: DelegacionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.delegacionService.departamentosConJefes().subscribe({
      next: (data) => this.departamentos = data.filter(d => d.activo),
    });
  }

  get depSeleccionado(): DepartamentoConJefeResponse | null {
    if (!this.departamentoId) return null;
    return this.departamentos.find(d => d.id === this.departamentoId) || null;
  }

  onDepartamentoChange(): void {
    this.titularId = null;
    this.delegadoId = null;
    this.empleados = [];

    if (!this.departamentoId) return;

    this.cargandoEmpleados.set(true);
    this.delegacionService.empleadosDepartamento(this.departamentoId).subscribe({
      next: (data) => {
        this.empleados = data;
        this.cargandoEmpleados.set(false);
      },
      error: () => this.cargandoEmpleados.set(false),
    });
  }

  get jefesDisponibles(): EmpleadoResponse[] {
    return this.empleados.filter(e => e.nivelJerarquico <= 4);
  }

  get delegadosDisponibles(): EmpleadoResponse[] {
    if (!this.titularId) return this.empleados;
    return this.empleados.filter(e => e.id !== this.titularId);
  }

  get formularioValido(): boolean {
    return this.titularId !== null
      && this.delegadoId !== null
      && this.fechaInicio.length > 0
      && this.motivo.trim().length >= 3;
  }

  guardar(): void {
    if (!this.formularioValido) {
      this.toastr.warning('Completa todos los campos obligatorios.', 'Formulario incompleto');
      return;
    }

    this.cargando.set(true);

    this.delegacionService.crear({
      titularId: this.titularId!,
      delegadoId: this.delegadoId!,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin || undefined,
      motivo: this.motivo.trim(),
    }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.toastr.success('Delegación creada correctamente.', '¡Listo!');
        this.dialogRef.close(true);
      },
      error: () => this.cargando.set(false),
    });
  }

  cancelar(): void { this.dialogRef.close(false); }
}
