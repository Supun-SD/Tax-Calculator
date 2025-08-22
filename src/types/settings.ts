export interface Settings {
  id: number;
  year: string;
  reliefsAndAit: ReliefsAndAit;
  taxRates: TaxRates;
}

export interface ReliefsAndAit {
  personalRelief: number;
  rentRelief: number;
  aitInterest: number;
  aitDividend: number;
  whtRent: number;
  foreignIncomeTaxRate: number;
}

export interface TaxRates {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  other: number;
}

export interface SettingsUpdateReq {
  year: string;
  reliefsAndAit: ReliefsAndAit;
  taxRates: TaxRates;
}
