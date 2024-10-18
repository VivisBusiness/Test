import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Rate } from '../../../models/rates.model';
import { ApiRates } from '../../../models/api-rates.model';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CurrencyService,
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    });

    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRates', () => {
    it('should return rates on success', () => {
      const mockRates: ApiRates = {
        rates: {
          USD: 1.0,
          EUR: 0.85,
          JPY: 110.0
        }
      };

      service.getRates().subscribe(rates => {
        expect(rates).toEqual(mockRates);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(mockRates);
    });

    it('should return null on error', () => {
      service.getRates().subscribe(rates => {
        expect(rates).toBeNull();
      });

      const req = httpMock.expectOne(service['apiUrl']);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('Local Rates management', () => {
    it('should load local rates from storage', () => {
      const mockRates: Rate[] = [{ code: 'USD', value: 1.0 }];
      localStorageService.getItem.and.returnValue(mockRates);

      service['loadLocalRates']();

      expect(service.getLocalRates()).toEqual(mockRates);
    });

    it('should add a new rate', () => {
      const rate: Rate = { code: 'USD', value: 1.0 };
      localStorageService.getItem.and.returnValue([]);

      service.addRate(rate);

      expect(service.getLocalRates()).toContain(rate);
      expect(localStorageService.setItem).toHaveBeenCalledWith('localRates', [rate]);
    });

    it('should delete a rate', () => {
      const rate: Rate = { code: 'USD', value: 1.0 };
      localStorageService.getItem.and.returnValue([rate]);

      service.deleteRate('USD');

      expect(service.getLocalRates()).not.toContain(rate);
      expect(localStorageService.setItem).toHaveBeenCalledWith('localRates', []);
    });

    it('should update a rate', () => {
      const rate: Rate = { code: 'USD', value: 1.0 };
      localStorageService.getItem.and.returnValue([rate]);

      service.updateRate('USD', 1.5);

      expect(service.getLocalRates()[0].value).toBe(1.5);
      expect(localStorageService.setItem).toHaveBeenCalledWith('localRates', [service.getLocalRates()[0]]);
    });

    it('should reset local rates', () => {
      localStorageService.getItem.and.returnValue([{ code: 'USD', value: 1.0 }]);

      service.resetLocalRates();

      expect(service.getLocalRates()).toEqual([]);
      expect(localStorageService.removeItem).toHaveBeenCalledWith('localRates');
    });
  });

  describe('setApiRates y getApiRates', () => {
    it('should set api rates in local storage', () => {
      const mockRates: ApiRates = {
        rates: {
          USD: 1.0,
          EUR: 0.85,
          JPY: 110.0
        }
      };

      service.setApiRates(mockRates);

      expect(localStorageService.setItem).toHaveBeenCalledWith('apiRates', mockRates);
    });

    it('should get api rates from local storage', () => {
      const mockRates: ApiRates = {
        rates: {
          USD: 1.0,
          EUR: 0.85,
          JPY: 110.0
        }
      };

      localStorageService.getItem.and.returnValue(mockRates);

      const rates = service.getApiRates();

      expect(rates).toEqual(mockRates);
    });

    it('should return null if api rates are not found in local storage', () => {
      localStorageService.getItem.and.returnValue(null);

      const rates = service.getApiRates();

      expect(rates).toBeNull();
    });

    it('should not update if the rate code does not exist', () => {
      service.localRates = [
        { code: 'rate1', value: 100 },
        { code: 'rate2', value: 200 },
      ];

      service.updateRate('rate3', 150);

      const rate1 = service.localRates.find(rate => rate.code === 'rate1');
      expect(rate1!.value).toBe(100);
    });
  });
});