import { Component, Inject, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PermisoService } from '../../../core/services/permiso.service';
import { PermisoResponse } from '../../../core/models/permiso.models';

@Component({
  selector: 'app-detalle-permiso-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './detalle-permiso-dialog.html',
  styleUrl: './detalle-permiso-dialog.scss',
})
export class DetallePermisoDialog implements OnInit {

  permiso: PermisoResponse | null = null;
  cargando = signal(true);

  constructor(
    private dialogRef: MatDialogRef<DetallePermisoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { permisoId: number },
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    this.permisoService.obtener(this.data.permisoId).subscribe({
      next: (data) => { this.permiso = data; this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  formatearFechaHora(fecha: string): string {
    const d = new Date(fecha);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const anio = d.getFullYear();
    const hora = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: 'Pendiente',
      AprobadoJefe: 'Aprobado por Jefe',
      AprobadoRRHH: 'Aprobado por RRHH',
      EnCurso: 'En Curso',
      Cerrado: 'Cerrado',
      Rechazado: 'Rechazado',
      Caducado: 'Caducado',
    };
    return map[estado] || estado;
  }

  getEstadoClase(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: 'estado-pendiente',
      AprobadoJefe: 'estado-aprobado-jefe',
      AprobadoRRHH: 'estado-aprobado',
      EnCurso: 'estado-en-curso',
      Cerrado: 'estado-cerrado',
      Rechazado: 'estado-rechazado',
      Caducado: 'estado-caducado',
    };
    return map[estado] || '';
  }

  getDecisionClase(decision: string): string {
    return decision === 'Aprobado' ? 'decision-aprobado' : 'decision-rechazado';
  }

  getDecisionIcon(decision: string): string {
    return decision === 'Aprobado' ? 'check_circle' : 'cancel';
  }
}
