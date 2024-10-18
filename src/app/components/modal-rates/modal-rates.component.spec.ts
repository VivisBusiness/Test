import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRatesComponent } from './modal-rates.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('ModalRatesComponent', () => {
  let component: ModalRatesComponent;
  let fixture: ComponentFixture<ModalRatesComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, ModalRatesComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { code: 'USD', value: 1.0 } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    expect(component.newRateCode).toBe('USD');
    expect(component.newRateValue).toBe(1.0);
  });

  it('should call dialogRef.close with correct data when rate is valid', () => {
    component.newRateCode = 'EUR';
    component.newRateValue = 0.85;
    component.addOrUpdateRate();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ code: 'EUR', value: 0.85 });
  });

  it('should not call dialogRef.close when rate is invalid', () => {
    component.newRateCode = '';
    component.newRateValue = null;
    component.addOrUpdateRate();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should reset data correctly', () => {
    component.newRateCode = 'USD';
    component.newRateValue = 1.0;
    component.resetData();
    expect(component.newRateCode).toBe('');
    expect(component.newRateValue).toBeNull();
  });  

  it('should set the field value correctly', () => {
    component.setFieldValue('newRateCode', 'GBP');
    expect(component.newRateCode).toBe('GBP');
    component.setFieldValue('newRateValue', 0.8);
    expect(component.newRateValue).toBe(0.8);
  });
  
});
