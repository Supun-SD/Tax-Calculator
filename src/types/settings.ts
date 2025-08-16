export interface Settings {
  reliefsAndAit: ReliefsAndAit;
  taxRates: TaxRates;
}

interface ReliefsAndAit {
  personalRelief: number;
  rentRelief: number;
  aitInterest: number;
  aitDividend: number;
  whtRent: number;
  foreignIncomeTaxRate: number;
}

interface TaxRates {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  other: number;
}
