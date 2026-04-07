import { Pipe, PipeTransform } from '@angular/core';
import { EstadoPermiso } from '../../core/models/permiso.models';

@Pipe({ name: 'estadoPermiso', standalone: true })
export class EstadoPermisoPipe implements PipeTransform {
  private readonly etiquetas: Record<EstadoPermiso, string> = {
    Pendiente: 'Pendiente',
    AprobadoJefe: 'Aprobado por Jefe',
    AprobadoRRHH: 'Aprobado por RRHH',
    EnCurso: 'En Curso',
    Cerrado: 'Cerrado',
    Rechazado: 'Rechazado',
    Caducado: 'Caducado',
  };

  transform(estado: EstadoPermiso): string {
    return this.etiquetas[estado] ?? estado;
  }
}