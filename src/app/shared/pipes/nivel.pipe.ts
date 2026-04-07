import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nivel', standalone: true })
export class NivelPipe implements PipeTransform {
  transform(nivel: number): string {
    const niveles: Record<number, string> = {
      1: 'Gerencia General',
      2: 'Gerencia',
      3: 'Jefatura',
      4: 'Supervisión',
      5: 'Operativo',
    };
    return niveles[nivel] ?? `Nivel ${nivel}`;
  }
}