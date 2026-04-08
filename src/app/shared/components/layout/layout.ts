import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { ToastrService } from 'ngx-toastr';

interface MenuItem {
  label: string;
  icon: string;
  ruta: string;
  badge?: number;
}

interface MenuGroup {
  titulo: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})


export class Layout implements OnInit {

  colapsado = signal(false);
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.usuario = this.storage.getUser();
  }

  get iniciales(): string {
    if (!this.usuario) return '??';
    const n = this.usuario.nombres?.charAt(0) || '';
    const a = this.usuario.apellidos?.charAt(0) || '';
    return (n + a).toUpperCase();
  }

  get nombreCorto(): string {
    if (!this.usuario) return 'Usuario';
    return `${this.usuario.nombres?.split(' ')[0]} ${this.usuario.apellidos?.split(' ')[0]}`;
  }

  get rolPrincipal(): string {
    if (this.usuario?.esAdmin) return 'Administrador';
    if (this.usuario?.esRRHH) return 'RRHH';
    if (this.usuario?.esVigilante) return 'Vigilante';
    if (this.usuario?.nivelJerarquico && this.usuario.nivelJerarquico <= 4) return 'Jefe';
    return 'Empleado';
  }

  get menuGroups(): MenuGroup[] {
    const groups: MenuGroup[] = [];

    // Principal — todos los empleados
    const principal: MenuItem[] = [
      { label: 'Mis permisos', icon: 'assignment_turned_in', ruta: '/permisos/mis-permisos' },
      { label: 'Solicitar permiso', icon: 'add_circle_outline', ruta: '/permisos/solicitar' },
    ];
    groups.push({ titulo: 'Principal', items: principal });

    // Gestión — jefes y RRHH
    const gestion: MenuItem[] = [];

    if (this.authService.esJefe()) {
      gestion.push({ label: 'Aprobaciones', icon: 'check_circle_outline', ruta: '/aprobaciones/pendientes' });
    }

    if (this.authService.hasRole('EsRRHH')) {
      gestion.push({ label: 'Pendientes RRHH', icon: 'pending_actions', ruta: '/rrhh/pendientes' });
      gestion.push({ label: 'Historial', icon: 'history', ruta: '/rrhh/historial' });
    }

    if (this.authService.esJefe() || this.authService.hasRole('EsRRHH')) {
      gestion.push({ label: 'Monitoreo', icon: 'visibility', ruta: '/monitoreo' });
    }

    if (gestion.length > 0) {
      groups.push({ titulo: 'Gestión', items: gestion });
    }

    // Vigilancia
    if (this.authService.hasRole('EsVigilante')) {
      groups.push({
        titulo: 'Vigilancia',
        items: [
          { label: 'Panel vigilancia', icon: 'security', ruta: '/vigilancia/panel' },
          { label: 'En curso', icon: 'directions_walk', ruta: '/vigilancia/en-curso' },
        ],
      });
    }

    // Administración
    if (this.authService.hasRole('EsAdmin')) {
      groups.push({
        titulo: 'Administración',
        items: [
          { label: 'Empleados', icon: 'people', ruta: '/admin/empleados' },
          { label: 'Departamentos', icon: 'business', ruta: '/admin/departamentos' },
          { label: 'Motivos de salida', icon: 'list_alt', ruta: '/admin/motivos' },
        ],
      });
    }

    return groups;
  }

  toggleSidebar(): void {
    this.colapsado.update(v => !v);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.info('Sesión cerrada correctamente.', '¡Hasta pronto!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.logoutLocal();
        this.router.navigate(['/login']);
      },
    });
  }
}
