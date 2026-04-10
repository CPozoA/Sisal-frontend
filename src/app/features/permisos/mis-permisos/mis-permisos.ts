import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PermisoService } from '../../../core/services/permiso.service';
import { PermisoResponse, EstadoPermiso } from '../../../core/models/permiso.models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetallePermisoDialog } from '../detalle-permiso-dialog/detalle-permiso-dialog';

@Component({
  selector: 'app-mis-permisos',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './mis-permisos.html',
  styleUrl: './mis-permisos.scss',
})
export class MisPermisos implements OnInit {

  permisos = signal<PermisoResponse[]>([]);
  filtro = '';
  filtroEstado: string = 'todos';
  cargando = signal(true);
  paginaActual = 1;
  itemsPorPagina = 8;

  constructor(
    private permisoService: PermisoService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.permisoService.misPermisos().subscribe({
      next: (data) => { this.permisos.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  // ── Métricas ──
  get pendientes(): number {
    return this.permisos().filter(p => p.estado === 'Pendiente' || p.estado === 'AprobadoJefe').length;
  }

  get aprobados(): number {
    return this.permisos().filter(p => p.estado === 'AprobadoRRHH' || p.estado === 'Cerrado').length;
  }

  get enCurso(): number {
    return this.permisos().filter(p => p.estado === 'EnCurso').length;
  }

  get rechazados(): number {
    return this.permisos().filter(p => p.estado === 'Rechazado').length;
  }

  // ── Filtros ──
  get permisosFiltrados(): PermisoResponse[] {
    let lista = this.permisos();

    if (this.filtroEstado !== 'todos') {
      const mapeo: Record<string, EstadoPermiso[]> = {
        'pendientes': ['Pendiente', 'AprobadoJefe'],
        'aprobados': ['AprobadoRRHH', 'Cerrado'],
        'en-curso': ['EnCurso'],
        'rechazados': ['Rechazado'],
        'caducados': ['Caducado'],
      };
      const estados = mapeo[this.filtroEstado] || [];
      lista = lista.filter(p => estados.includes(p.estado));
    }

    if (this.filtro.trim()) {
      const t = this.filtro.toLowerCase();
      lista = lista.filter(p =>
        p.nombreMotivo.toLowerCase().includes(t) ||
        p.observacion?.toLowerCase().includes(t) ||
        p.placaVehiculo?.toLowerCase().includes(t)
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

  get etiquetaFiltro(): string {
    const map: Record<string, string> = {
      'todos': 'Todos', 'pendientes': 'Pendientes', 'aprobados': 'Aprobados',
      'en-curso': 'En curso', 'rechazados': 'Rechazados', 'caducados': 'Caducados',
    };
    return map[this.filtroEstado] || 'Todos';
  }

  buscar(): void { this.paginaActual = 1; }

  ciclarFiltro(): void {
    const estados = ['todos', 'pendientes', 'aprobados', 'en-curso', 'rechazados', 'caducados'];
    const idx = estados.indexOf(this.filtroEstado);
    this.filtroEstado = estados[(idx + 1) % estados.length];
    this.paginaActual = 1;
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  nuevoPermiso(): void {
    this.router.navigate(['/permisos/solicitar']);
  }

  // ── Helpers ──
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

  verDetalle(permiso: PermisoResponse): void {
    this.dialog.open(DetallePermisoDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: { permisoId: permiso.id },
      panelClass: 'dialog-redondeado',
    });
  }
}
