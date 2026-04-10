import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VehiculoService } from '../../../../core/services/vehiculo.service';
import { VehiculoResponse } from '../../../../core/models/vehiculo.models';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { FormVehiculo } from '../form-vehiculo/form-vehiculo';

@Component({
  selector: 'app-lista-vehiculos',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './lista-vehiculos.html',
  styleUrl: './lista-vehiculos.scss',
})
export class ListaVehiculos implements OnInit {

  vehiculos = signal<VehiculoResponse[]>([]);
  filtro = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  cargando = signal(true);
  paginaActual = 1;
  itemsPorPagina = 5;

  constructor(
    private vehiculoService: VehiculoService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.vehiculoService.listar().subscribe({
      next: (data) => { this.vehiculos.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  get vehiculosFiltrados(): VehiculoResponse[] {
    let lista = this.vehiculos();
    if (this.filtroEstado === 'activos') lista = lista.filter(v => v.activo);
    else if (this.filtroEstado === 'inactivos') lista = lista.filter(v => !v.activo);

    if (this.filtro.trim()) {
      const t = this.filtro.toLowerCase();
      lista = lista.filter(v =>
        v.placa.toLowerCase().includes(t) ||
        v.marca.toLowerCase().includes(t) ||
        v.modelo.toLowerCase().includes(t) ||
        v.color.toLowerCase().includes(t)
      );
    }
    return lista;
  }

  get totalPaginas(): number { return Math.ceil(this.vehiculosFiltrados.length / this.itemsPorPagina); }

  get vehiculosPaginados(): VehiculoResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.vehiculosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
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

  abrirFormulario(vehiculo?: VehiculoResponse): void {
    const dialogRef = this.dialog.open(FormVehiculo, {
      width: '460px',
      data: vehiculo || null,
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.cargar(); });
  }

  desactivar(v: VehiculoResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Desactivar vehículo',
        mensaje: `¿Estás seguro de desactivar el vehículo "${v.placa} - ${v.marca} ${v.modelo}"?\nNo estará disponible para asignar a permisos.`,
        botonConfirmar: 'Desactivar',
      },
      panelClass: 'dialog-redondeado',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehiculoService.desactivar(v.id).subscribe({
          next: () => { this.toastr.success(`"${v.placa}" ha sido desactivado.`, 'Vehículo desactivado'); this.cargar(); },
        });
      }
    });
  }

  activar(v: VehiculoResponse): void {
    this.vehiculoService.activar(v.id).subscribe({
      next: () => { this.toastr.success(`"${v.placa}" ha sido activado.`, 'Vehículo activado'); this.cargar(); },
    });
  }

  getColorHex(color: string): string {
    const colores: Record<string, string> = {
      'blanco': '#e0e0e0',
      'negro': '#333',
      'rojo': '#e53935',
      'azul': '#1976d2',
      'gris': '#9e9e9e',
      'plata': '#bdbdbd',
      'plateado': '#bdbdbd',
      'verde': '#43a047',
      'amarillo': '#fdd835',
      'dorado': '#f9a825',
      'naranja': '#ef6c00',
      'marrón': '#6d4c41',
      'marron': '#6d4c41',
      'beige': '#d7ccc8',
    };
    return colores[color.toLowerCase()] || '#9e9e9e';
  }
}
