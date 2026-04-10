import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from '../../../../core/services/empleado.service';
import { DepartamentoService } from '../../../../core/services/departamento.service';
import { EmpleadoResponse } from '../../../../core/models/empleado.models';
import { DepartamentoResponse } from '../../../../core/models/departamento.models';

@Component({
  selector: 'app-form-empleado',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './form-empleado.html',
  styleUrl: './form-empleado.scss',
})
export class FormEmpleado implements OnInit {

  tocadoDep = false;
  tocadoNivel = false;

  nombres = '';
  apellidos = '';
  documento = '';
  email = '';
  celular = '';
  departamentoId: number | null = null;
  jefeDirectoId: number | null = null;
  nivelJerarquico: number | null = null;
  esAdmin = false;
  esRRHH = false;
  esVigilante = false;

  cargando = signal(false);
  esEdicion = false;
  empleadoId = 0;

  departamentos: DepartamentoResponse[] = [];
  jefes: EmpleadoResponse[] = [];

  niveles = [
    { valor: 1, nombre: 'Nivel 1 — Gerencia General' },
    { valor: 2, nombre: 'Nivel 2 — Gerencia' },
    { valor: 3, nombre: 'Nivel 3 — Jefatura' },
    { valor: 4, nombre: 'Nivel 4 — Supervisión' },
    { valor: 5, nombre: 'Nivel 5 — Operativo' },
  ];

  constructor(
    private dialogRef: MatDialogRef<FormEmpleado>,
    @Inject(MAT_DIALOG_DATA) public data: EmpleadoResponse | null,
    private empleadoService: EmpleadoService,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService
  ) {
    if (data) {
      this.esEdicion = true;
      this.empleadoId = data.id;
      this.nombres = data.nombres;
      this.apellidos = data.apellidos;
      this.documento = data.documento;
      this.email = data.email;
      this.celular = data.celular || '';
      this.nivelJerarquico = data.nivelJerarquico;
      this.esAdmin = data.esAdmin;
      this.esRRHH = data.esRRHH;
      this.esVigilante = data.esVigilante;
    }
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarJefes();
  }

  cargarDepartamentos(): void {
    this.departamentoService.listar().subscribe({
      next: (data) => {
        this.departamentos = data.filter(d => d.activo);
        if (this.data) {
          const dep = data.find(d => d.nombre === this.data!.nombreDepartamento);
          if (dep) this.departamentoId = dep.id;
        }
      },
    });
  }

  cargarJefes(): void {
    this.empleadoService.listar().subscribe({
      next: (data) => {
        this.jefes = data.filter(e => e.activo && e.nivelJerarquico <= 4 && e.id !== this.empleadoId);
        if (this.data?.nombreJefe) {
          const jefe = data.find(e => e.nombreCompleto === this.data!.nombreJefe);
          if (jefe) this.jefeDirectoId = jefe.id;
        }
      },
    });
  }

  get formularioValido(): boolean {
    return this.nombres.trim().length >= 2
      && this.apellidos.trim().length >= 2
      && /^\d{8}$/.test(this.documento)
      && this.email.trim().length >= 5
      && this.departamentoId !== null
      && this.nivelJerarquico !== null;
  }

  soloNumeros(event: KeyboardEvent): void {
    const permitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'];
    if (permitidas.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }

  guardar(): void {
    if (!this.formularioValido) {
      this.toastr.warning('Completa todos los campos obligatorios.', 'Formulario incompleto');
      return;
    }

    this.cargando.set(true);

    if (this.esEdicion) {
      this.empleadoService.actualizar({
        id: this.empleadoId,
        nombres: this.nombres.trim(),
        apellidos: this.apellidos.trim(),
        email: this.email.trim(),
        celular: this.celular.trim() || undefined,
        departamentoId: this.departamentoId!,
        nivelJerarquico: this.nivelJerarquico!,
        jefeDirectoId: this.jefeDirectoId || undefined,
        esAdmin: this.esAdmin,
        esRRHH: this.esRRHH,
        esVigilante: this.esVigilante,
        activo: true,
      }).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Empleado actualizado correctamente.', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => this.cargando.set(false),
      });
    } else {
      this.empleadoService.crear({
        nombres: this.nombres.trim(),
        apellidos: this.apellidos.trim(),
        documento: this.documento.trim(),
        email: this.email.trim(),
        celular: this.celular.trim() || undefined,
        departamentoId: this.departamentoId!,
        nivelJerarquico: this.nivelJerarquico!,
        jefeDirectoId: this.jefeDirectoId || undefined,
        esAdmin: this.esAdmin,
        esRRHH: this.esRRHH,
        esVigilante: this.esVigilante,
      }).subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastr.success('Empleado creado correctamente. Clave: Sisal2026!', '¡Listo!');
          this.dialogRef.close(true);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  get documentoValido(): boolean {
    return /^\d{8}$/.test(this.documento);
  }

  get celularValido(): boolean {
    if (!this.celular) return false;
    return /^9\d{8}$/.test(this.celular);
  }

  get emailValido(): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email.trim());
  }

  cancelar(): void { this.dialogRef.close(false); }
}
