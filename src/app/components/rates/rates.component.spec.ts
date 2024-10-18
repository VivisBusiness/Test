import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatesComponent } from './rates.component';
import { CurrencyService } from '../../services/currency/currency.service';
import { of, throwError } from 'rxjs';
import { Rate } from '../../../models/rates.model';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalRatesComponent } from '../modal-rates/modal-rates.component';

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;
  let mockCurrencyService: jasmine.SpyObj<CurrencyService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const MOCK_RATES = { rates: { USD: 1, EUR: 0.9 } };
  const LOCAL_RATES: Rate[] = [{ code: 'MXN', value: 20 }];
  const NEW_RATE = { code: 'JPY', value: 110 };
  const EXISTING_RATE: Rate = { code: 'USD', value: 1.0 };
  const UPDATED_RATE: Rate = { code: 'USD', value: 1.2 };
  const SERVICE_ERROR = 'Error del servicio';

  beforeEach(async () => {
    mockCurrencyService = jasmine.createSpyObj('CurrencyService', [
      'getRates', 'setApiRates', 'resetLocalRates', 'addRate', 'updateRate', 
      'deleteRate', 'getApiRates', 'getLocalRates'
    ]);

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [RatesComponent, ModalRatesComponent],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    
    fixture = TestBed.createComponent(RatesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    mockCurrencyService.getRates.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rates on init', () => {
    mockCurrencyService.getRates.and.returnValue(of(MOCK_RATES));
  
    component.ngOnInit();
  
    expect(mockCurrencyService.resetLocalRates).toHaveBeenCalled();
    expect(mockCurrencyService.getRates).toHaveBeenCalled();
  });

  it('should update data source with API and local rates', () => {
    const apiRates = { rates: { USD: 1, EUR: 0.9 } };
    mockCurrencyService.getApiRates.and.returnValue(apiRates);
    mockCurrencyService.getLocalRates.and.returnValue(LOCAL_RATES);
  
    component.updateDataSource();
  
    expect(component.dataSource.data).toEqual([
      { code: 'USD', value: 1 },
      { code: 'EUR', value: 0.9 },
      { code: 'MXN', value: 20 },
    ]);
  });

  it('should add new rate', () => {
    component.dataSource.data = [{ code: 'USD', value: 1 }];
  
    component.addNewRate(NEW_RATE);
  
    expect(component.dataSource.data).toContain(NEW_RATE);
    expect(mockCurrencyService.addRate).toHaveBeenCalledWith(NEW_RATE);
  });

  it('should delete rate', () => {
    const rateToDelete = { code: 'USD', value: 1 };
    component.dataSource.data = [rateToDelete];
  
    component.deleteRate('USD');
  
    expect(component.dataSource.data).not.toContain(rateToDelete);
    expect(mockCurrencyService.deleteRate).toHaveBeenCalledWith('USD');
  });

  it('should update the existing rate', () => {
    component.dataSource.data = [EXISTING_RATE];
  
    component.updateExistingRate(UPDATED_RATE);
  
    expect(component.dataSource.data[0].value).toBe(1.2);
    expect(mockCurrencyService.updateRate).toHaveBeenCalledWith(UPDATED_RATE.code, UPDATED_RATE.value);
  });

  it('should open modal with existing rate data for editing', () => {
    spyOn(component, 'openModal');
  
    component.editRate(EXISTING_RATE);
  
    expect(component.openModal).toHaveBeenCalledWith(EXISTING_RATE);
  });

  it('should reset local rates and reload rates from the API', () => {
    spyOn(component, 'loadRates').and.callThrough();

    component.resetData();

    expect(mockCurrencyService.resetLocalRates).toHaveBeenCalled();
    expect(component.loadRates).toHaveBeenCalled();
  });

  it('should log an error when data is invalid', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockCurrencyService.getRates.and.returnValue(of(null));

    component.loadRates();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Datos de tasas no válidos:', null);
  });

  it('should log an error when there is a service error', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockCurrencyService.getRates.and.returnValue(throwError(SERVICE_ERROR));

    component.loadRates();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener tasas:', SERVICE_ERROR);
  });

  it('should handle empty rates gracefully', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockCurrencyService.getRates.and.returnValue(of({ rates: {} }));

    component.loadRates();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Datos de tasas no válidos:', { rates: {} });
  });

  it('should log an error when an unexpected error occurs', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockCurrencyService.getRates.and.returnValue(throwError({ message: 'Unexpected error' }));

    component.loadRates();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener tasas:', { message: 'Unexpected error' });
  });
});
