import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule],
template: `
    <div style="padding: 4px;">
      <h2 style="font-size: 16px; font-weight: 500; margin: 0 0 8px;">{{ data.titulo }}</h2>
      <p style="font-size: 13px; color: #666; margin: 0 0 20px; line-height: 1.6; white-space: pre-line;">{{ data.mensaje }}</p>
      <div style="display: flex; gap: 10px;">
        <button mat-dialog-close
                style="flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 10px; background: white; font-size: 13px; color: #666; cursor: pointer;">
          Cancelar
        </button>
        <button [mat-dialog-close]="true"
                style="flex: 1; padding: 10px; border: none; border-radius: 10px; background: #e53935; color: white; font-size: 13px; font-weight: 500; cursor: pointer;">
          {{ data.botonConfirmar || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    titulo: string;
    mensaje: string;
    botonConfirmar?: string;
  }) {}
}
