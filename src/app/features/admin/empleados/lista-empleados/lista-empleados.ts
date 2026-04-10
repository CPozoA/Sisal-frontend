import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from '../../../../core/services/empleado.service';
import { EmpleadoResponse } from '../../../../core/models/empleado.models';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { FormEmpleado } from '../form-empleado/form-empleado';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule, MatTooltipModule],
  templateUrl: './lista-empleados.html',
  styleUrl: './lista-empleados.scss',
})
export class ListaEmpleados implements OnInit {

  empleados = signal<EmpleadoResponse[]>([]);
  filtro = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  cargando = signal(true);
  paginaActual = 1;
  itemsPorPagina = 8;

  private colores = ['#185FA5', '#0F6E56', '#534AB7', '#D85A30', '#993556', '#854F0B', '#A32D2D', '#3B6D11'];

  constructor(
    private empleadoService: EmpleadoService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.empleadoService.listar().subscribe({
      next: (data) => { this.empleados.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  get empleadosFiltrados(): EmpleadoResponse[] {
    let lista = this.empleados();
    if (this.filtroEstado === 'activos') lista = lista.filter(e => e.activo);
    else if (this.filtroEstado === 'inactivos') lista = lista.filter(e => !e.activo);

    if (this.filtro.trim()) {
      const t = this.filtro.toLowerCase();
      lista = lista.filter(e =>
        e.nombreCompleto.toLowerCase().includes(t) ||
        e.documento.includes(t) ||
        e.email?.toLowerCase().includes(t) ||
        e.nombreDepartamento?.toLowerCase().includes(t)
      );
    }
    return lista;
  }

  get totalPaginas(): number { return Math.ceil(this.empleadosFiltrados.length / this.itemsPorPagina); }

  get empleadosPaginados(): EmpleadoResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.empleadosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }

  get etiquetaFiltro(): string {
    if (this.filtroEstado === 'activos') return 'Activos';
    if (this.filtroEstado === 'inactivos') return 'Inactivos';
    return 'Todos';
  }

  buscar(): void { this.paginaActual = 1; }

  ciclarFiltro(): void {
    if (this.filtroEstado === 'todos') this.filtroEstado = 'activos';
    else if (this.filtroEstado === 'activos') this.filtroEstado = 'inactivos';
    else this.filtroEstado = 'todos';
    this.paginaActual = 1;
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  getIniciales(emp: EmpleadoResponse): string {
    const n = emp.nombres?.charAt(0) || '';
    const a = emp.apellidos?.charAt(0) || '';
    return (n + a).toUpperCase();
  }

  getColorAvatar(emp: EmpleadoResponse): string {
    return this.colores[emp.id % this.colores.length];
  }

  getRoles(emp: EmpleadoResponse): string[] {
    const roles: string[] = [];
    if (emp.esAdmin) roles.push('Admin');
    if (emp.esRRHH) roles.push('RRHH');
    if (emp.esVigilante) roles.push('Vigilante');
    return roles;
  }

  abrirFormulario(empleado?: EmpleadoResponse): void {
    const dialogRef = this.dialog.open(FormEmpleado, {
      width: '520px',
      maxWidth: '95vw',
      data: empleado || null,
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargar(); });
  }

  resetearClave(emp: EmpleadoResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Resetear contraseña',
        mensaje: `¿Resetear la contraseña de "${emp.nombreCompleto}"?\nLa nueva clave será Sisal2026! y deberá cambiarla en su próximo login.`,
        botonConfirmar: 'Resetear',
      },
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empleadoService.resetearClave(emp.id).subscribe({
          next: () => {
            this.toastr.success(`Clave de "${emp.nombreCompleto}" reseteada a Sisal2026!`, 'Clave reseteada');
            this.cargar();
          },
        });
      }
    });
  }

  desactivar(emp: EmpleadoResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Desactivar empleado',
        mensaje: `¿Estás seguro de desactivar a "${emp.nombreCompleto}"?\nNo podrá acceder al sistema.`,
        botonConfirmar: 'Desactivar',
      },
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empleadoService.desactivar(emp.id).subscribe({
          next: () => {
            this.toastr.success(`"${emp.nombreCompleto}" ha sido desactivado.`, 'Empleado desactivado');
            this.cargar();
          },
        });
      }
    });
  }

  activar(emp: EmpleadoResponse): void {
    this.empleadoService.activar(emp.id).subscribe({
      next: () => {
        this.toastr.success(`"${emp.nombreCompleto}" ha sido activado.`, 'Empleado activado');
        this.cargar();
      },
    });
  }
}
