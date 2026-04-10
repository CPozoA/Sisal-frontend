import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermisoService } from '../../../core/services/permiso.service';
import { PermisoResponse, EstadoPermiso } from '../../../core/models/permiso.models';
import { DetallePermisoDialog } from '../../permisos/detalle-permiso-dialog/detalle-permiso-dialog';

interface EmpleadoHoras {
  nombre: string;
  totalMinutos: number;
  cantidadSalidas: number;
  porcentaje: number;
}

@Component({
  selector: 'app-historial-equipo',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule, MatTooltipModule],
  templateUrl: './historial-equipo.html',
  styleUrl: './historial-equipo.scss',
})
export class HistorialEquipo implements OnInit {
  permisos = signal<PermisoResponse[]>([]);
  cargando = signal(true);

  filtro = '';
  desde = '';
  hasta = '';
  estadoFiltro = '';
  empleadoFiltro = '';
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
    private dialog: MatDialog,
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

    this.permisoService.historialEquipo(filtros).subscribe({
      next: (data) => {
        this.permisos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  limpiar(): void {
    this.filtro = '';
    this.desde = '';
    this.hasta = '';
    this.estadoFiltro = '';
    this.empleadoFiltro = '';
    this.buscar();
  }

  // ── Filtrado local ──
  get permisosFiltrados(): PermisoResponse[] {
    let lista = this.permisos();

    if (this.empleadoFiltro) {
      lista = lista.filter((p) => p.nombreEmpleado === this.empleadoFiltro);
    }

    if (this.filtro.trim()) {
      const t = this.filtro.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombreEmpleado.toLowerCase().includes(t) ||
          p.nombreMotivo.toLowerCase().includes(t) ||
          p.observacion?.toLowerCase().includes(t),
      );
    }

    return lista;
  }

  // ── Empleados únicos para el select ──
  get empleadosUnicos(): string[] {
    const nombres = new Set(this.permisos().map((p) => p.nombreEmpleado));
    return Array.from(nombres).sort();
  }

  // ── Permisos con vigilancia (para calcular horas) ──
  get permisosConVigilancia(): PermisoResponse[] {
    return this.permisosFiltrados.filter((p) => p.registroVigilancia?.horaSalida);
  }

  // ── Métricas ──
  get horasTotalesMinutos(): number {
    return this.permisosConVigilancia.reduce((total, p) => total + this.calcularMinutos(p), 0);
  }

  get horasTotalesLabel(): string {
    return this.formatearMinutos(this.horasTotalesMinutos);
  }

  get totalSalidas(): number {
    return this.permisosConVigilancia.length;
  }

  get empleadosConSalidas(): number {
    const nombres = new Set(this.permisosConVigilancia.map((p) => p.nombreEmpleado));
    return nombres.size;
  }

  get promedioLabel(): string {
    if (this.empleadosConSalidas === 0) return '0h 00m';
    return this.formatearMinutos(Math.round(this.horasTotalesMinutos / this.empleadosConSalidas));
  }

  // ── Horas por empleado (barras) ──
  get horasPorEmpleado(): EmpleadoHoras[] {
    const mapa = new Map<string, { minutos: number; salidas: number }>();

    this.permisosConVigilancia.forEach((p) => {
      const mins = this.calcularMinutos(p);
      const actual = mapa.get(p.nombreEmpleado) || { minutos: 0, salidas: 0 };
      actual.minutos += mins;
      actual.salidas += 1;
      mapa.set(p.nombreEmpleado, actual);
    });

    const lista: EmpleadoHoras[] = [];
    const maxMinutos = Math.max(...Array.from(mapa.values()).map((v) => v.minutos), 1);

    mapa.forEach((valor, nombre) => {
      lista.push({
        nombre,
        totalMinutos: valor.minutos,
        cantidadSalidas: valor.salidas,
        porcentaje: Math.round((valor.minutos / maxMinutos) * 100),
      });
    });

    return lista.sort((a, b) => b.totalMinutos - a.totalMinutos);
  }

  // ── Paginación ──
  get totalPaginas(): number {
    return Math.ceil(this.permisosFiltrados.length / this.itemsPorPagina);
  }

  get permisosPaginados(): PermisoResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.permisosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  filtrarLocal(): void {
    this.paginaActual = 1;
  }

  // ── Cálculos de tiempo ──
  calcularMinutos(permiso: PermisoResponse): number {
    if (!permiso.registroVigilancia?.horaSalida) return 0;
    const salida = new Date(permiso.registroVigilancia.horaSalida).getTime();
    const retorno = permiso.registroVigilancia.horaRetorno
      ? new Date(permiso.registroVigilancia.horaRetorno).getTime()
      : Date.now();
    return Math.max(0, Math.round((retorno - salida) / 60000));
  }

  getTiempoLabel(permiso: PermisoResponse): string {
    if (!permiso.registroVigilancia?.horaSalida) return '—';
    const mins = this.calcularMinutos(permiso);
    if (permiso.estado === 'EnCurso') return this.formatearMinutos(mins);
    return this.formatearMinutos(mins);
  }

  getTiempoClase(permiso: PermisoResponse): string {
    if (permiso.estado === 'EnCurso') return 'tiempo-en-curso';
    return 'tiempo-cerrado';
  }

  formatearMinutos(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }

  getHoraSalida(permiso: PermisoResponse): string {
    if (!permiso.registroVigilancia?.horaSalida) return '—';
    const d = new Date(permiso.registroVigilancia.horaSalida);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  getHoraRetorno(permiso: PermisoResponse): string {
    if (!permiso.registroVigilancia?.horaRetorno) return '—';
    const d = new Date(permiso.registroVigilancia.horaRetorno);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  formatearHora(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  getEstadoLabel(estado: EstadoPermiso): string {
    const map: Record<EstadoPermiso, string> = {
      Pendiente: 'Pendiente',
      AprobadoJefe: 'Aprob. Jefe',
      AprobadoRRHH: 'Aprob. RRHH',
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
