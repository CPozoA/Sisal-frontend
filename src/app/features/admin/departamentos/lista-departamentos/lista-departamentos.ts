import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DepartamentoService } from '../../../../core/services/departamento.service';
import { DepartamentoResponse } from '../../../../core/models/departamento.models';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { FormDepartamento } from '../form-departamento/form-departamento';

@Component({
  selector: 'app-lista-departamentos',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './lista-departamentos.html',
  styleUrl: './lista-departamentos.scss',
})
export class ListaDepartamentos implements OnInit {

  departamentos = signal<DepartamentoResponse[]>([]);
  filtro = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  cargando = signal(true);
  paginaActual = 1;
  itemsPorPagina = 15;

  constructor(
    private departamentoService: DepartamentoService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.departamentoService.listar().subscribe({
      next: (data) => {
        this.departamentos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  get departamentosFiltrados(): DepartamentoResponse[] {
    let lista = this.departamentos();

    if (this.filtroEstado === 'activos') {
      lista = lista.filter(d => d.activo);
    } else if (this.filtroEstado === 'inactivos') {
      lista = lista.filter(d => !d.activo);
    }

    if (this.filtro.trim()) {
      const termino = this.filtro.toLowerCase();
      lista = lista.filter(d =>
        d.nombre.toLowerCase().includes(termino) ||
        d.descripcion?.toLowerCase().includes(termino)
      );
    }

    return lista;
  }

  get totalPaginas(): number {
    return Math.ceil(this.departamentosFiltrados.length / this.itemsPorPagina);
  }

  get departamentosPaginados(): DepartamentoResponse[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.departamentosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get etiquetaFiltro(): string {
    if (this.filtroEstado === 'activos') return 'Activos';
    if (this.filtroEstado === 'inactivos') return 'Inactivos';
    return 'Todos';
  }

  ciclarFiltro(): void {
    if (this.filtroEstado === 'todos') this.filtroEstado = 'activos';
    else if (this.filtroEstado === 'activos') this.filtroEstado = 'inactivos';
    else this.filtroEstado = 'todos';
    this.paginaActual = 1;
  }

  abrirFormulario(departamento?: DepartamentoResponse): void {
    const dialogRef = this.dialog.open(FormDepartamento, {
      width: '420px',
      data: departamento || null,
      panelClass: 'dialog-redondeado',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargar();
    });
  }

  desactivar(dep: DepartamentoResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Desactivar departamento',
        mensaje: `¿Estás seguro de desactivar la oficina de "${dep.nombre}"? \nLos empleados asociados no podrán seleccionarlo.`,
        botonConfirmar: 'Desactivar',
      },
      panelClass: 'dialog-redondeado',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departamentoService.desactivar(dep.id).subscribe({
          next: () => {
            this.toastr.success(`"${dep.nombre}" ha sido desactivado.`, 'Departamento desactivado');
            this.cargar();
          },
        });
      }
    });
  }

  activar(dep: DepartamentoResponse): void {
    this.departamentoService.activar(dep.id).subscribe({
      next: () => {
        this.toastr.success(`"${dep.nombre}" ha sido activado.`, 'Departamento activado');
        this.cargar();
      },
    });
  }

  buscar(): void {
    this.paginaActual = 1;
  }
}
