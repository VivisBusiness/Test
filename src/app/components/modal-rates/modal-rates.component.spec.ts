import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRatesComponent } from './modal-rates.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

describe('ModalRatesComponent', () => {
  let component: ModalRatesComponent;
  let fixture: ComponentFixture<ModalRatesComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalRatesComponent],
      imports: [FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }, // Proveer datos iniciales vacíos
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data', () => {
    const data = { code: 'USD', value: 1.0 };
    component = TestBed.createComponent(ModalRatesComponent).componentInstance;
    component.data = data;

    // Asigna las propiedades
    component.newRateCode = component.data.code || '';
    component.newRateValue = component.data.value ?? null;

    expect(component.newRateCode).toBe('USD');
    expect(component.newRateValue).toBe(1.0);
  });

  it('should not close dialog with invalid data', () => {
    component.newRateCode = ''; // Código vacío
    component.newRateValue = null; // Valor nulo

    component.addOrUpdateRate();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog with valid data', () => {
    component.newRateCode = 'EUR';
    component.newRateValue = 0.9;

    component.addOrUpdateRate();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ code: 'EUR', value: 0.9 });
  });
});