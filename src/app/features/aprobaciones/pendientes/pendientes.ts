import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from '../../../core/services/permiso.service';
import { AuthService } from '../../../core/services/auth.service';
import { PermisoResponse } from '../../../core/models/permiso.models';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { RechazoDialog } from '../rechazo-dialog/rechazo-dialog';

@Component({
  selector: 'app-pendientes',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatTooltipModule],
  templateUrl: './pendientes.html',
  styleUrl: './pendientes.scss',
})
export class Pendientes implements OnInit {

  permisos = signal<PermisoResponse[]>([]);
  cargando = signal(true);
  esRRHH = false;

  private colores = ['#185FA5', '#0F6E56', '#534AB7', '#D85A30', '#993556', '#854F0B', '#A32D2D', '#3B6D11'];

  constructor(
    private permisoService: PermisoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.esRRHH = this.authService.hasRole('EsRRHH');
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.permisoService.pendientesParaAprobar().subscribe({
      next: (data) => { this.permisos.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  getIniciales(nombre: string): string {
    const partes = nombre.split(' ');
    const n = partes[0]?.charAt(0) || '';
    const a = partes[1]?.charAt(0) || '';
    return (n + a).toUpperCase();
  }

  getColorAvatar(id: number): string {
    return this.colores[id % this.colores.length];
  }

  getTiempoTranscurrido(fecha: string): string {
    const ahora = new Date();
    const solicitud = new Date(fecha);
    const diffMs = ahora.getTime() - solicitud.getTime();
    const minutos = Math.floor(diffMs / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `hace ${minutos} min`;
    return 'justo ahora';
  }

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const anio = d.getFullYear();
    const hora = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
  }

  aprobar(permiso: PermisoResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        titulo: 'Aprobar permiso',
        mensaje: `¿Aprobar el permiso de "${permiso.nombreEmpleado}"?\nMotivo: ${permiso.nombreMotivo}`,
        botonConfirmar: 'Aprobar',
        colorBoton: '#43a047',
      },
      panelClass: 'dialog-redondeado',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request = { permisoId: permiso.id, comentario: 'Aprobado' };

        if (this.esRRHH) {
          this.permisoService.aprobarRRHH(request).subscribe({
            next: () => {
              this.toastr.success(`Permiso de "${permiso.nombreEmpleado}" aprobado.`, '¡Aprobado!');
              this.cargar();
            },
          });
        } else {
          this.permisoService.aprobarJefe(request).subscribe({
            next: () => {
              this.toastr.success(`Permiso de "${permiso.nombreEmpleado}" aprobado.`, '¡Aprobado!');
              this.cargar();
            },
          });
        }
      }
    });
  }

  rechazar(permiso: PermisoResponse): void {
    const dialogRef = this.dialog.open(RechazoDialog, {
      width: '420px',
      data: { nombreEmpleado: permiso.nombreEmpleado },
      panelClass: 'dialog-redondeado',
    });

    dialogRef.afterClosed().subscribe(comentario => {
      if (comentario) {
        const request = { permisoId: permiso.id, comentario };

        if (this.esRRHH) {
          this.permisoService.rechazarRRHH(request).subscribe({
            next: () => {
              this.toastr.success(`Permiso de "${permiso.nombreEmpleado}" rechazado.`, 'Rechazado');
              this.cargar();
            },
          });
        } else {
          this.permisoService.rechazarJefe(request).subscribe({
            next: () => {
              this.toastr.success(`Permiso de "${permiso.nombreEmpleado}" rechazado.`, 'Rechazado');
              this.cargar();
            },
          });
        }
      }
    });
  }
}
