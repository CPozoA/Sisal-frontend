import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { DelegacionService } from '../../../../core/services/delegacion.service';
import { DelegacionResponse } from '../../../../core/models/delegacion.models';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { FormDelegacion } from '../form-delegacion/form-delegacion';

@Component({
  selector: 'app-lista-delegaciones',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule, MatTooltipModule],
  templateUrl: './lista-delegaciones.html',
  styleUrl: './lista-delegaciones.scss',
})
export class ListaDelegaciones implements OnInit {

  delegaciones = signal<DelegacionResponse[]>([]);
  filtro = '';
  filtroEstado: 'todas' | 'activas' | 'revocadas' = 'todas';
  cargando = signal(true);
  paginaActual = 1;
  itemsPorPagina = 8;

  private colores = ['#185FA5', '#0F6E56', '#534AB7', '#D85A30', '#993556', '#854F0B', '#A32D2D', '#3B6D11'];

  constructor(
    private delegacionService: DelegacionService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.delegacionService.listar().subscribe({
      next: (data) => { this.delegaciones.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  get delegacionesFiltradas(): DelegacionResponse[] {
    let lista = this.delegaciones();

    if (this.filtroEstado === 'activas') lista = lista.filter(d => d.activa);
    else if (this.filtroEstado === 'revocadas') lista = lista.filter(d => !d.activa);

    if (this.filtro.trim()) {
      const t = this.filtro.toLowerCase();
      lista = lista.filter(d =>
        d.nombreTitular.toLowerCase().includes(t) ||
        d.nombreDelegado.toLowerCase().includes(t) ||
        d.motivo?.toLowerCase().includes(t)
      );
    }

    return lista;
  }

  get totalPaginas(): number { return Math.ceil(this.delegacionesFiltradas.length / this.itemsPorPagina); }

  get delegacionesPaginadas(): DelegacionResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.delegacionesFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }

  get etiquetaFiltro(): string {
    if (this.filtroEstado === 'activas') return 'Activas';
    if (this.filtroEstado === 'revocadas') return 'Revocadas';
    return 'Todas';
  }

  buscar(): void { this.paginaActual = 1; }

  ciclarFiltro(): void {
    if (this.filtroEstado === 'todas') this.filtroEstado = 'activas';
    else if (this.filtroEstado === 'activas') this.filtroEstado = 'revocadas';
    else this.filtroEstado = 'todas';
    this.paginaActual = 1;
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  getIniciales(nombre: string): string {
    const partes = nombre.split(' ');
    return ((partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')).toUpperCase();
  }

  getColor(id: number): string {
    return this.colores[id % this.colores.length];
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(FormDelegacion, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargar(); });
  }

  revocar(del: DelegacionResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Revocar delegación',
        mensaje: `¿Revocar la delegación de "${del.nombreTitular}" a "${del.nombreDelegado}"?\n"${del.nombreDelegado}" dejará de aprobar permisos en su nombre.`,
        botonConfirmar: 'Revocar',
      },
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delegacionService.revocar(del.id).subscribe({
          next: () => {
            this.toastr.success('Delegación revocada correctamente.', 'Revocada');
            this.cargar();
          },
        });
      }
    });
  }
}
