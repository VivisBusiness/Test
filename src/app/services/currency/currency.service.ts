import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Rate } from '../../../models/rates.model';
import { ApiRates } from '../../../models/api-rates.model';

@Injectable({
  providedIn: 'root',
})

export class CurrencyService {
  private apiUrl = environment.apiUrlExchangerate;
  public localRates: Rate[] = [];

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.loadLocalRates();
  }

  getRates(): Observable<ApiRates | null> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': environment.xRapidApiKey,
      'x-rapidapi-host': environment.xRapidapiHost,
    });

    return this.http.get<ApiRates>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener tasas:', error);
        return of(null);
      })
    );
  }

  private loadLocalRates(): void {
    this.localRates = this.localStorageService.getItem<Rate[]>('localRates') || [];
  }

  getLocalRates(): Rate[] {
    return this.localRates;
  }

  addRate(rate: Rate): void {
    this.localRates.push(rate);
    this.localStorageService.setItem('localRates', this.localRates);
  }

  deleteRate(code: string): void {
    this.localRates = this.localRates.filter(rate => rate.code !== code);
    this.localStorageService.setItem('localRates', this.localRates);
  }

  updateRate(code: string, newValue: number): void {
    const rate = this.localRates.find(rate => rate.code === code);
    if (rate) {
      rate.value = newValue;
      this.localStorageService.setItem('localRates', this.localRates);
    }
  }

  resetLocalRates(): void {
    this.localRates = [];
    this.localStorageService.removeItem('localRates');
  }

  setApiRates(data: ApiRates): void {
    this.localStorageService.setItem('apiRates', data);
  }

  getApiRates(): ApiRates | null {
    return this.localStorageService.getItem<ApiRates>('apiRates');
  }
}
