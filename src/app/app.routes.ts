import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { cambioClaveGuard } from './core/guards/cambio-clave.guard';

export const routes: Routes = [

  // ── Auth ──
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'cambiar-clave',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/cambiar-clave/cambiar-clave').then(m => m.CambiarClave),
  },

  // ── Permisos (cualquier empleado autenticado) ──
  {
    path: 'permisos',
    canActivate: [authGuard, cambioClaveGuard],
    children: [
      {
        path: 'mis-permisos',
        loadComponent: () =>
          import('./features/permisos/mis-permisos/mis-permisos').then(m => m.MisPermisos),
      },
      {
        path: 'solicitar',
        loadComponent: () =>
          import('./features/permisos/solicitar-permiso/solicitar-permiso').then(m => m.SolicitarPermiso),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/permisos/detalle-permiso/detalle-permiso').then(m => m.DetallePermiso),
      },
    ],
  },

  // ── Aprobaciones (jefes) ──
  {
    path: 'aprobaciones',
    canActivate: [authGuard, cambioClaveGuard],
    children: [
      {
        path: 'pendientes',
        loadComponent: () =>
          import('./features/aprobaciones/pendientes/pendientes').then(m => m.Pendientes),
      },
    ],
  },

  // ── Vigilancia ──
  {
    path: 'vigilancia',
    canActivate: [authGuard, cambioClaveGuard, roleGuard],
    data: { roles: ['EsVigilante'] },
    children: [
      {
        path: 'panel',
        loadComponent: () =>
          import('./features/vigilancia/panel-vigilancia/panel-vigilancia').then(m => m.PanelVigilancia),
      },
      {
        path: 'en-curso',
        loadComponent: () =>
          import('./features/vigilancia/en-curso/en-curso').then(m => m.EnCurso),
      },
    ],
  },

  // ── Monitoreo ──
  {
    path: 'monitoreo',
    canActivate: [authGuard, cambioClaveGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/monitoreo/empleados-afuera/empleados-afuera').then(m => m.EmpleadosAfuera),
      },
    ],
  },

  // ── RRHH ──
  {
    path: 'rrhh',
    canActivate: [authGuard, cambioClaveGuard, roleGuard],
    data: { roles: ['EsRRHH'] },
    children: [
      {
        path: 'pendientes',
        loadComponent: () =>
          import('./features/rrhh/panel-rrhh/panel-rrhh').then(m => m.PanelRrhh),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./features/rrhh/historial/historial').then(m => m.Historial),
      },
    ],
  },

  // ── Admin ──
  {
    path: 'admin',
    canActivate: [authGuard, cambioClaveGuard, roleGuard],
    data: { roles: ['EsAdmin'] },
    children: [
      {
        path: 'empleados',
        loadComponent: () =>
          import('./features/admin/empleados/lista-empleados/lista-empleados').then(m => m.ListaEmpleados),
      },
      {
        path: 'empleados/crear',
        loadComponent: () =>
          import('./features/admin/empleados/crear-empleado/crear-empleado').then(m => m.CrearEmpleado),
      },
      {
        path: 'empleados/editar/:id',
        loadComponent: () =>
          import('./features/admin/empleados/editar-empleado/editar-empleado').then(m => m.EditarEmpleado),
      },
      {
        path: 'departamentos',
        loadComponent: () =>
          import('./features/admin/departamentos/lista-departamentos/lista-departamentos').then(m => m.ListaDepartamentos),
      },
      {
        path: 'departamentos/form',
        loadComponent: () =>
          import('./features/admin/departamentos/form-departamento/form-departamento').then(m => m.FormDepartamento),
      },
      {
        path: 'departamentos/form/:id',
        loadComponent: () =>
          import('./features/admin/departamentos/form-departamento/form-departamento').then(m => m.FormDepartamento),
      },
      {
        path: 'motivos',
        loadComponent: () =>
          import('./features/admin/motivos/lista-motivos/lista-motivos').then(m => m.ListaMotivos),
      },
      {
        path: 'motivos/form',
        loadComponent: () =>
          import('./features/admin/motivos/form-motivo/form-motivo').then(m => m.FormMotivo),
      },
      {
        path: 'motivos/form/:id',
        loadComponent: () =>
          import('./features/admin/motivos/form-motivo/form-motivo').then(m => m.FormMotivo),
      },
    ],
  },

  // ── Redirects ──
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];