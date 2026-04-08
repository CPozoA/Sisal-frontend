import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { cambioClaveGuard } from './core/guards/cambio-clave.guard';

export const routes: Routes = [

  // ── Auth (sin layout) ──
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

  // ── Rutas protegidas (con layout) ──
  {
    path: '',
    canActivate: [authGuard, cambioClaveGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout').then(m => m.Layout),
    children: [

      // Permisos
      {
        path: 'permisos/mis-permisos',
        loadComponent: () =>
          import('./features/permisos/mis-permisos/mis-permisos').then(m => m.MisPermisos),
      },
      {
        path: 'permisos/solicitar',
        loadComponent: () =>
          import('./features/permisos/solicitar-permiso/solicitar-permiso').then(m => m.SolicitarPermiso),
      },
      {
        path: 'permisos/:id',
        loadComponent: () =>
          import('./features/permisos/detalle-permiso/detalle-permiso').then(m => m.DetallePermiso),
      },

      // Aprobaciones
      {
        path: 'aprobaciones/pendientes',
        loadComponent: () =>
          import('./features/aprobaciones/pendientes/pendientes').then(m => m.Pendientes),
      },

      // Vigilancia
      {
        path: 'vigilancia/panel',
        canActivate: [roleGuard],
        data: { roles: ['EsVigilante'] },
        loadComponent: () =>
          import('./features/vigilancia/panel-vigilancia/panel-vigilancia').then(m => m.PanelVigilancia),
      },
      {
        path: 'vigilancia/en-curso',
        canActivate: [roleGuard],
        data: { roles: ['EsVigilante'] },
        loadComponent: () =>
          import('./features/vigilancia/en-curso/en-curso').then(m => m.EnCurso),
      },

      // Monitoreo
      {
        path: 'monitoreo',
        loadComponent: () =>
          import('./features/monitoreo/empleados-afuera/empleados-afuera').then(m => m.EmpleadosAfuera),
      },

      // RRHH
      {
        path: 'rrhh/pendientes',
        canActivate: [roleGuard],
        data: { roles: ['EsRRHH'] },
        loadComponent: () =>
          import('./features/rrhh/panel-rrhh/panel-rrhh').then(m => m.PanelRrhh),
      },
      {
        path: 'rrhh/historial',
        canActivate: [roleGuard],
        data: { roles: ['EsRRHH'] },
        loadComponent: () =>
          import('./features/rrhh/historial/historial').then(m => m.Historial),
      },

      // Admin
      {
        path: 'admin/empleados',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/empleados/lista-empleados/lista-empleados').then(m => m.ListaEmpleados),
      },
      {
        path: 'admin/empleados/crear',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/empleados/crear-empleado/crear-empleado').then(m => m.CrearEmpleado),
      },
      {
        path: 'admin/empleados/editar/:id',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/empleados/editar-empleado/editar-empleado').then(m => m.EditarEmpleado),
      },
      {
        path: 'admin/departamentos',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/departamentos/lista-departamentos/lista-departamentos').then(m => m.ListaDepartamentos),
      },
      {
        path: 'admin/departamentos/form',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/departamentos/form-departamento/form-departamento').then(m => m.FormDepartamento),
      },
      {
        path: 'admin/departamentos/form/:id',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/departamentos/form-departamento/form-departamento').then(m => m.FormDepartamento),
      },
      {
        path: 'admin/motivos',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/motivos/lista-motivos/lista-motivos').then(m => m.ListaMotivos),
      },
      {
        path: 'admin/motivos/form',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/motivos/form-motivo/form-motivo').then(m => m.FormMotivo),
      },
      {
        path: 'admin/motivos/form/:id',
        canActivate: [roleGuard],
        data: { roles: ['EsAdmin'] },
        loadComponent: () =>
          import('./features/admin/motivos/form-motivo/form-motivo').then(m => m.FormMotivo),
      },

      // Default dentro del layout
      { path: '', redirectTo: 'permisos/mis-permisos', pathMatch: 'full' },
    ],
  },

  // ── Fallback ──
  { path: '**', redirectTo: 'login' },
];
