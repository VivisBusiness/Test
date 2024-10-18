import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormField } from '../../../models/form-field.model';

export interface DialogData {
  code?: string;
  value?: number | null;
}

@Component({
  selector: 'app-modal-rates',
  standalone: true,
  templateUrl: './modal-rates.component.html',
  styleUrls: ['./modal-rates.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})

export class ModalRatesComponent {
  newRateCode: string = '';
  newRateValue: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalRatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.code) {
      this.newRateCode = data.code;
      this.newRateValue = data.value ?? null;
    }
  }

  formFields: FormField[] = [
    {
      label: 'Código',
      placeholder: 'Ingrese el código',
      property: 'newRateCode',
      type: 'string'
    },
    {
      label: 'Valor',
      placeholder: 'Ingrese el valor',
      property: 'newRateValue',
      type: 'number'
    }
  ];

  addOrUpdateRate(): void {
    if (this.isRateValid()) {
      this.dialogRef.close({ code: this.newRateCode, value: this.newRateValue });
    }
  }

  isRateValid(): boolean {
    return !!this.newRateCode && this.newRateValue !== null;
  }

  resetData(): void {
    this.newRateCode = '';
    this.newRateValue = null;
  }

  getFieldValue(property: keyof this): any {
    return this[property];
  }

  setFieldValue(property: keyof this, value: any): void {
    this[property] = value;
  }

}