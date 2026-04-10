import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-observacion-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>{{ data.titulo }}</h3>
        <mat-icon class="close-icon" (click)="cancelar()">close</mat-icon>
      </div>

      <div class="info-card">
        <div class="info-row">
          <mat-icon>person</mat-icon>
          <span class="info-nombre">{{ data.nombreEmpleado }}</span>
        </div>
        <div class="info-row">
          <mat-icon>description</mat-icon>
          <span>{{ data.nombreMotivo }}</span>
        </div>
      </div>

      <div class="custom-field">
        <label>Observación <span class="optional">(opcional)</span></label>
        <div class="input-wrapper textarea-wrapper">
          <textarea [(ngModel)]="observacion"
                    [placeholder]="data.placeholder"
                    rows="2"></textarea>
        </div>
      </div>

      <div class="dialog-actions">
        <button class="btn-cancel" (click)="cancelar()">Cancelar</button>
        <button class="btn-confirm" [style.background]="data.colorBoton" (click)="confirmar()">
          <mat-icon>{{ data.icono }}</mat-icon>
          {{ data.botonTexto }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 4px; }
    .dialog-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
      h3 { font-size: 16px; font-weight: 500; color: #1a1a1a; margin: 0; }
      .close-icon { color: #aaa; font-size: 20px; width: 20px; height: 20px; cursor: pointer; }
      .close-icon:hover { color: #666; }
    }
    .info-card {
      background: #f9fafb; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .info-row {
      display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #aaa; }
    }
    .info-nombre { font-weight: 500; color: #1a1a1a; }
    .custom-field {
      margin-bottom: 12px;
      label { display: block; font-size: 13px; color: #777; margin-bottom: 6px; }
      .optional { color: #bbb; font-size: 11px; }
    }
    .input-wrapper {
      background: #f5f6f8; border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 12px 14px;
      transition: border-color 0.2s, background 0.2s;
    }
    .input-wrapper:hover { border-color: #ccc; }
    .input-wrapper:focus-within { border-color: #185FA5; background: white; }
    textarea {
      width: 100%; border: none; outline: none; background: transparent; font-size: 13px;
      color: #333; resize: vertical; font-family: inherit; min-height: 50px;
    }
    textarea::placeholder { color: #c0c0c0; }
    .dialog-actions { display: flex; gap: 10px; margin-top: 8px; }
    .btn-cancel {
      flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 10px; background: white;
      font-size: 13px; color: #666; cursor: pointer;
    }
    .btn-cancel:hover { background: #f5f5f5; }
    .btn-confirm {
      flex: 1; padding: 10px; border: none; border-radius: 10px; color: white;
      font-size: 13px; font-weight: 500; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn-confirm:hover { opacity: 0.9; }
    .btn-confirm mat-icon { font-size: 16px; width: 16px; height: 16px; }
  `],
})
export class ObservacionDialog {

  observacion = '';

  constructor(
    private dialogRef: MatDialogRef<ObservacionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string;
      nombreEmpleado: string;
      nombreMotivo: string;
      placeholder: string;
      botonTexto: string;
      colorBoton: string;
      icono: string;
    }
  ) {}

  confirmar(): void {
    this.dialogRef.close({ confirmado: true, observacion: this.observacion.trim() });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
