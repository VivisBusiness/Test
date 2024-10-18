type ModalRateProperties = 'newRateCode' | 'newRateValue';

export interface FormField {
  label: string;
  placeholder: string;
  property: ModalRateProperties;
  type: string;
}