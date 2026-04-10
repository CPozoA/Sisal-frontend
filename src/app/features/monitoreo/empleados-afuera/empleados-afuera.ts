import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MonitoreoService } from '../../../core/services/monitoreo.service';
import { EmpleadoAfueraResponse } from '../../../core/models/monitoreo.models';

@Component({
  selector: 'app-empleados-afuera',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './empleados-afuera.html',
  styleUrl: './empleados-afuera.scss',
})
export class EmpleadosAfuera implements OnInit, OnDestroy {

  empleados = signal<EmpleadoAfueraResponse[]>([]);
  cargando = signal(true);
  ultimaActualizacion = signal('');
  private intervalo: any;

  private colores = ['#185FA5', '#0F6E56', '#534AB7', '#D85A30', '#993556', '#854F0B', '#A32D2D', '#3B6D11'];

  constructor(private monitoreoService: MonitoreoService) {}

  ngOnInit(): void {
    this.cargar();
    // Auto-refresh cada 30 segundos
    this.intervalo = setInterval(() => this.cargar(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  cargar(): void {
    this.monitoreoService.empleadosAfuera().subscribe({
      next: (data) => {
        this.empleados.set(data);
        this.cargando.set(false);
        this.ultimaActualizacion.set(this.getHoraActual());
      },
      error: () => this.cargando.set(false),
    });
  }

  getIniciales(nombre: string): string {
    const partes = nombre.split(' ');
    return ((partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')).toUpperCase();
  }

  getColorAvatar(id: number): string {
    return this.colores[id % this.colores.length];
  }

  formatearHora(fecha: string): string {
    const d = new Date(fecha);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  getColorTiempo(minutos: number): string {
    if (minutos <= 30) return '#43a047';
    if (minutos <= 60) return '#ef9f27';
    return '#e53935';
  }

  getBgTiempo(minutos: number): string {
    if (minutos <= 30) return '#e8f5e9';
    if (minutos <= 60) return '#fff3e0';
    return '#fef2f2';
  }

  private getHoraActual(): string {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }
}
