import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PermisoService } from '../../../core/services/permiso.service';
import { PermisoResponse, EstadoPermiso } from '../../../core/models/permiso.models';
import { DetallePermisoDialog } from '../../permisos/detalle-permiso-dialog/detalle-permiso-dialog';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
})
export class Historial implements OnInit {

  permisos = signal<PermisoResponse[]>([]);
  cargando = signal(true);

  filtro = '';
  desde = '';
  hasta = '';
  estadoFiltro = '';
  paginaActual = 1;
  itemsPorPagina = 10;

  estados: { valor: string; label: string }[] = [
    { valor: '', label: 'Todos' },
    { valor: 'Pendiente', label: 'Pendiente' },
    { valor: 'AprobadoJefe', label: 'Aprobado Jefe' },
    { valor: 'AprobadoRRHH', label: 'Aprobado RRHH' },
    { valor: 'EnCurso', label: 'En Curso' },
    { valor: 'Cerrado', label: 'Cerrado' },
    { valor: 'Rechazado', label: 'Rechazado' },
    { valor: 'Caducado', label: 'Caducado' },
  ];

  constructor(
    private permisoService: PermisoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.cargando.set(true);
    this.paginaActual = 1;

    const filtros: any = {};
    if (this.desde) filtros.desde = this.desde;
    if (this.hasta) filtros.hasta = this.hasta;
    if (this.estadoFiltro) filtros.estado = this.estadoFiltro;

    this.permisoService.historial(filtros).subscribe({
      next: (data) => { this.permisos.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  limpiar(): void {
    this.filtro = '';
    this.desde = '';
    this.hasta = '';
    this.estadoFiltro = '';
    this.buscar();
  }

  get permisosFiltrados(): PermisoResponse[] {
    let lista = this.permisos();

    if (this.filtro.trim()) {
      const t = this.filtro.toLowerCase();
      lista = lista.filter(p =>
        p.nombreEmpleado.toLowerCase().includes(t) ||
        p.nombreMotivo.toLowerCase().includes(t) ||
        p.observacion?.toLowerCase().includes(t)
      );
    }

    return lista;
  }

  get totalPaginas(): number { return Math.ceil(this.permisosFiltrados.length / this.itemsPorPagina); }

  get permisosPaginados(): PermisoResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.permisosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  filtrarLocal(): void { this.paginaActual = 1; }

  verDetalle(permiso: PermisoResponse): void {
    this.dialog.open(DetallePermisoDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: { permisoId: permiso.id },
      panelClass: 'dialog-redondeado',
    });
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  formatearHora(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  getEstadoLabel(estado: EstadoPermiso): string {
    const map: Record<EstadoPermiso, string> = {
      Pendiente: 'Pendiente',
      AprobadoJefe: 'Aprobado Jefe',
      AprobadoRRHH: 'Aprobado RRHH',
      EnCurso: 'En Curso',
      Cerrado: 'Cerrado',
      Rechazado: 'Rechazado',
      Caducado: 'Caducado',
    };
    return map[estado] || estado;
  }

  getEstadoClase(estado: EstadoPermiso): string {
    const map: Record<EstadoPermiso, string> = {
      Pendiente: 'badge-pendiente',
      AprobadoJefe: 'badge-aprobado-jefe',
      AprobadoRRHH: 'badge-aprobado',
      EnCurso: 'badge-en-curso',
      Cerrado: 'badge-cerrado',
      Rechazado: 'badge-rechazado',
      Caducado: 'badge-caducado',
    };
    return map[estado] || '';
  }
}
