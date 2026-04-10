import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rechazo-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>Rechazar permiso</h3>
        <mat-icon class="close-icon" (click)="cancelar()">close</mat-icon>
      </div>

      <p class="dialog-desc">
        Estás rechazando el permiso de <strong>{{ data.nombreEmpleado }}</strong>.
        El comentario es obligatorio.
      </p>

      <div class="custom-field">
        <label>Motivo del rechazo</label>
        <div class="input-wrapper textarea-wrapper" [class.input-error]="comentario.length > 0 && comentario.trim().length < 10">
          <textarea [(ngModel)]="comentario"
                    placeholder="Explica el motivo del rechazo (mínimo 10 caracteres)"
                    rows="3"></textarea>
        </div>
        @if (comentario.length > 0 && comentario.trim().length < 10) {
          <span class="error-text">Mínimo 10 caracteres ({{ comentario.trim().length }}/10)</span>
        }
      </div>

      <div class="dialog-actions">
        <button class="btn-cancel" (click)="cancelar()">Cancelar</button>
        <button class="btn-reject" (click)="confirmar()" [disabled]="comentario.trim().length < 10">
          Rechazar permiso
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 4px; }
    .dialog-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
      h3 { font-size: 16px; font-weight: 500; color: #1a1a1a; margin: 0; }
      .close-icon { color: #aaa; font-size: 20px; width: 20px; height: 20px; cursor: pointer; }
      .close-icon:hover { color: #666; }
    }
    .dialog-desc { font-size: 13px; color: #666; margin: 0 0 16px; line-height: 1.5; }
    .dialog-desc strong { color: #333; }
    .custom-field {
      margin-bottom: 12px;
      label { display: block; font-size: 13px; color: #777; margin-bottom: 6px; }
    }
    .input-wrapper {
      background: #f5f6f8; border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 12px 14px;
      transition: border-color 0.2s, background 0.2s;
    }
    .input-wrapper:hover { border-color: #ccc; }
    .input-wrapper:focus-within { border-color: #185FA5; background: white; }
    .input-error { border-color: #e53935 !important; }
    .input-error:focus-within { border-color: #e53935 !important; }
    textarea {
      width: 100%; border: none; outline: none; background: transparent; font-size: 13px;
      color: #333; resize: vertical; font-family: inherit; min-height: 60px;
    }
    textarea::placeholder { color: #c0c0c0; }
    .error-text { display: block; font-size: 11px; color: #e53935; margin-top: 4px; padding-left: 4px; }
    .dialog-actions { display: flex; gap: 10px; margin-top: 8px; }
    .btn-cancel {
      flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 10px; background: white;
      font-size: 13px; color: #666; cursor: pointer;
    }
    .btn-cancel:hover { background: #f5f5f5; }
    .btn-reject {
      flex: 1; padding: 10px; border: none; border-radius: 10px; background: #e53935; color: white;
      font-size: 13px; font-weight: 500; cursor: pointer;
    }
    .btn-reject:hover:not(:disabled) { background: #c62828; }
    .btn-reject:disabled { opacity: 0.6; cursor: not-allowed; }
  `],
})
export class RechazoDialog {

  comentario = '';

  constructor(
    private dialogRef: MatDialogRef<RechazoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { nombreEmpleado: string }
  ) {}

  confirmar(): void {
    if (this.comentario.trim().length >= 10) {
      this.dialogRef.close(this.comentario.trim());
    }
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
