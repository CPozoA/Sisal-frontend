import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MotivoSalidaService } from '../../../../core/services/motivo-salida.service';
import { MotivoSalidaResponse } from '../../../../core/models/motivo-salida.models';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { FormMotivo } from '../form-motivo/form-motivo';

@Component({
  selector: 'app-lista-motivos',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './lista-motivos.html',
  styleUrl: './lista-motivos.scss',
})
export class ListaMotivos implements OnInit {

  motivos = signal<MotivoSalidaResponse[]>([]);
  filtro = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  cargando = signal(true);
  paginaActual = 1;
  itemsPorPagina = 15;

  constructor(
    private motivoService: MotivoSalidaService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.motivoService.listar().subscribe({
      next: (data) => {
        this.motivos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  get motivosFiltrados(): MotivoSalidaResponse[] {
    let lista = this.motivos();

    if (this.filtroEstado === 'activos') lista = lista.filter(m => m.activo);
    else if (this.filtroEstado === 'inactivos') lista = lista.filter(m => !m.activo);

    if (this.filtro.trim()) {
      const termino = this.filtro.toLowerCase();
      lista = lista.filter(m =>
        m.nombre.toLowerCase().includes(termino) ||
        m.descripcion?.toLowerCase().includes(termino)
      );
    }

    return lista;
  }

  get totalPaginas(): number {
    return Math.ceil(this.motivosFiltrados.length / this.itemsPorPagina);
  }

  get motivosPaginados(): MotivoSalidaResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.motivosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

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

  abrirFormulario(motivo?: MotivoSalidaResponse): void {
    const dialogRef = this.dialog.open(FormMotivo, {
      width: '420px',
      data: motivo || null,
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargar(); });
  }

  desactivar(motivo: MotivoSalidaResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Desactivar motivo de salida',
        mensaje: `¿Estás seguro de desactivar "${motivo.nombre}"?\nLos empleados no podrán seleccionarlo al solicitar permisos.`,
        botonConfirmar: 'Desactivar',
      },
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.motivoService.desactivar(motivo.id).subscribe({
          next: () => {
            this.toastr.success(`"${motivo.nombre}" ha sido desactivado.`, 'Motivo desactivado');
            this.cargar();
          },
        });
      }
    });
  }

  activar(motivo: MotivoSalidaResponse): void {
    this.motivoService.activar(motivo.id).subscribe({
      next: () => {
        this.toastr.success(`"${motivo.nombre}" ha sido activado.`, 'Motivo activado');
        this.cargar();
      },
    });
  }
}
