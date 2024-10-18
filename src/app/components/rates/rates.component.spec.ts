import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatesComponent } from './rates.component';
import { CurrencyService } from '../../services/currency/currency.service';
import { of, throwError } from 'rxjs';
import { Rate } from '../../../models/rates.model';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;
  let mockCurrencyService: jasmine.SpyObj<CurrencyService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockCurrencyService = jasmine.createSpyObj('CurrencyService', [
      'getRates', 'setApiRates', 'resetLocalRates', 'addRate', 'updateRate', 
      'deleteRate', 'getApiRates', 'getLocalRates'
    ]);

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [RatesComponent],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    
    fixture = TestBed.createComponent(RatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rates on init', () => {
    const mockRates = { rates: { USD: 1, EUR: 0.9 } };
    mockCurrencyService.getRates.and.returnValue(of(mockRates));
  
    component.ngOnInit();
  
    expect(mockCurrencyService.resetLocalRates).toHaveBeenCalled();
    expect(mockCurrencyService.getRates).toHaveBeenCalled();
  });

  it('should update data source with API and local rates', () => {
    const apiRates = { rates: { USD: 1, EUR: 0.9 } };
    const localRates: Rate[] = [{ code: 'MXN', value: 20 }];
    mockCurrencyService.getApiRates.and.returnValue(apiRates);
    mockCurrencyService.getLocalRates.and.returnValue(localRates);
  
    component.updateDataSource();
  
    expect(component.dataSource.data).toEqual([
      { code: 'USD', value: 1 },
      { code: 'EUR', value: 0.9 },
      { code: 'MXN', value: 20 },
    ]);
  });

  it('should add new rate', () => {
    const newRate = { code: 'JPY', value: 110 };
    component.dataSource.data = [{ code: 'USD', value: 1 }];
  
    component.addNewRate(newRate);
  
    expect(component.dataSource.data).toContain(newRate);
    expect(mockCurrencyService.addRate).toHaveBeenCalledWith(newRate);
  });

  it('should delete rate', () => {
    const rateToDelete = { code: 'USD', value: 1 };
    component.dataSource.data = [rateToDelete];
  
    component.deleteRate('USD');
  
    expect(component.dataSource.data).not.toContain(rateToDelete);
    expect(mockCurrencyService.deleteRate).toHaveBeenCalledWith('USD');
  });
});
