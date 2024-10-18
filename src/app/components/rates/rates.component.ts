import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CurrencyService } from '../../services/currency/currency.service';
import { Rate } from '../../../models/rates.model';
import { ModalRatesComponent } from '../modal-rates/modal-rates.component';

@Component({
  selector: 'app-rates',
  standalone: true,
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss'],
  imports: [MatInputModule, MatButtonModule, MatTableModule, FormsModule, MatIconModule],
})

export class RatesComponent implements OnInit {
  displayedColumns: string[] = ['code', 'value', 'actions'];
  dataSource = new MatTableDataSource<Rate>();

  constructor(public currencyService: CurrencyService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRates();
  }

  public loadRates(): void {
    this.currencyService.resetLocalRates();
    this.currencyService.getRates().subscribe({
      next: (data) => {
        if (data) {
          //this.currencyService.setApiRates(data);
          this.updateDataSource();
        } else {
          console.error('Datos de tasas no válidos:', data);
        }
      },
      error: (error) => {
        console.error('Error al obtener tasas:', error);
      },
    });
  }

  public updateDataSource(): void {
    const apiRates = this.currencyService.getApiRates();
    
    if (apiRates) {
      const rates: Rate[] = Object.entries(apiRates.rates).map(([code, value]) => {
        return { code, value: typeof value === 'number' ? value : Number(value) };
      });

      const localRates = this.currencyService.getLocalRates();
      this.dataSource.data = [...rates, ...localRates];
    } else {
      console.error('No se pudieron cargar las tasas de la API.');
    }
  }

  openModal(rate?: Rate): void {
    const dialogRef = this.dialog.open(ModalRatesComponent, {
      data: { code: rate?.code, value: rate?.value },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (rate) {
          this.updateExistingRate(result);
        } else {
          this.addNewRate(result);
        }
      }
    });
  }

  public addNewRate(rate: Rate): void {
    const newRate: Rate = { code: rate.code, value: rate.value! };
    if (!this.dataSource.data.some(existingRate => existingRate.code === newRate.code)) {
      this.dataSource.data = [...this.dataSource.data, newRate];
      this.currencyService.addRate(newRate);
    } else {
      console.warn(`La tasa con el código ${newRate.code} ya existe.`);
    }
  }

  public updateExistingRate(rate: Rate): void {
    const index = this.dataSource.data.findIndex(existingRate => existingRate.code === rate.code);
    if (index !== -1) {
      this.dataSource.data[index].value = rate.value;
      this.currencyService.updateRate(rate.code, rate.value);
    }
  }

  editRate(rate: Rate): void {
    this.openModal(rate);
  }

  deleteRate(code: string): void {
    this.dataSource.data = this.dataSource.data.filter(rate => rate.code !== code);
    this.currencyService.deleteRate(code);
  }

  resetData(): void {
    this.currencyService.resetLocalRates();
    this.loadRates();
  } 
}
