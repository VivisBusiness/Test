import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService, ApiRates, Rate } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });

    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get rates from the API', () => {
    const dummyRates: ApiRates = { rates: { USD: 1, EUR: 0.85 } };

    service.getRates().subscribe(rates => {
      expect(rates).toEqual(dummyRates);
    });

    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyRates);
  });

  it('should handle error when getting rates', () => {
    service.getRates().subscribe(rates => {
      expect(rates).toBeNull();
    });

    const req = httpMock.expectOne(service.apiUrl);
    req.error(new ErrorEvent('Network error'));
  });

  it('should set and get API rates', () => {
    const rates: ApiRates = { rates: { USD: 1, EUR: 0.85 } };
    service.setApiRates(rates);
    expect(service.getApiRates()).toEqual(rates);
  });

  it('should manage local rates', () => {
    const rate: Rate = { code: 'EUR', value: 0.85 };
    
    service.addRate(rate);
    expect(service.getLocalRates()).toContain(rate);

    service.updateRate('EUR', 0.90);
    expect(service.getLocalRates().find(r => r.code === 'EUR')?.value).toBe(0.90);

    service.deleteRate('EUR');
    expect(service.getLocalRates()).not.toContain(rate);
  });

  it('should reset local rates', () => {
    const rate: Rate = { code: 'EUR', value: 0.85 };
    service.addRate(rate);
    expect(service.getLocalRates()).toContain(rate);

    service.resetLocalRates();
    expect(service.getLocalRates()).toEqual([]);
  });
});