import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VigilanciaService } from '../../../core/services/vigilancia.service';
import { PermisoResponse } from '../../../core/models/permiso.models';
import { ObservacionDialog } from '../observacion-dialog/observacion-dialog';

@Component({
  selector: 'app-panel-vigilancia',
  standalone: true,
  imports: [MatIconModule, MatDialogModule],
  templateUrl: './panel-vigilancia.html',
  styleUrl: './panel-vigilancia.scss',
})
export class PanelVigilancia implements OnInit {

  permisosDelDia = signal<PermisoResponse[]>([]);
  permisosEnCurso = signal<PermisoResponse[]>([]);
  cargando = signal(true);

  private colores = ['#185FA5', '#0F6E56', '#534AB7', '#D85A30', '#993556', '#854F0B', '#A32D2D', '#3B6D11'];

  constructor(
    private vigilanciaService: VigilanciaService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    let a = false, b = false;

    this.vigilanciaService.permisosDelDia().subscribe({
      next: (data) => { this.permisosDelDia.set(data); a = true; if (b) this.cargando.set(false); },
      error: () => { a = true; if (b) this.cargando.set(false); },
    });

    this.vigilanciaService.enCurso().subscribe({
      next: (data) => { this.permisosEnCurso.set(data); b = true; if (a) this.cargando.set(false); },
      error: () => { b = true; if (a) this.cargando.set(false); },
    });
  }

  getIniciales(nombre: string): string {
    const partes = nombre.split(' ');
    return ((partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')).toUpperCase();
  }

  getColorAvatar(id: number): string {
    return this.colores[id % this.colores.length];
  }

  getMinutosAfuera(permiso: PermisoResponse): number {
    if (!permiso.registroVigilancia?.horaSalida) return 0;
    const salida = new Date(permiso.registroVigilancia.horaSalida);
    const ahora = new Date();
    return Math.floor((ahora.getTime() - salida.getTime()) / 60000);
  }

  formatearHora(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  registrarSalida(permiso: PermisoResponse): void {
    const dialogRef = this.dialog.open(ObservacionDialog, {
      width: '420px',
      data: {
        titulo: 'Registrar salida',
        nombreEmpleado: permiso.nombreEmpleado,
        nombreMotivo: permiso.nombreMotivo,
        placeholder: 'Ej: Salió con documentos',
        botonTexto: 'Registrar salida',
        colorBoton: '#43a047',
        icono: 'logout',
      },
      panelClass: 'dialog-redondeado',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmado) {
        this.vigilanciaService.registrarSalida({
          permisoId: permiso.id,
          observacion: result.observacion || undefined,
        }).subscribe({
          next: () => {
            this.toastr.success(`Salida de "${permiso.nombreEmpleado}" registrada.`, '¡Salida registrada!');
            this.cargar();
          },
        });
      }
    });
  }

  registrarRetorno(permiso: PermisoResponse): void {
    const dialogRef = this.dialog.open(ObservacionDialog, {
      width: '420px',
      data: {
        titulo: 'Registrar retorno',
        nombreEmpleado: permiso.nombreEmpleado,
        nombreMotivo: permiso.nombreMotivo,
        placeholder: 'Ej: Retornó sin novedad',
        botonTexto: 'Registrar retorno',
        colorBoton: '#1976d2',
        icono: 'login',
      },
      panelClass: 'dialog-redondeado',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmado) {
        this.vigilanciaService.registrarRetorno({
          permisoId: permiso.id,
          observacion: result.observacion || undefined,
        }).subscribe({
          next: () => {
            this.toastr.success(`Retorno de "${permiso.nombreEmpleado}" registrado.`, '¡Retorno registrado!');
            this.cargar();
          },
        });
      }
    });
  }
}
