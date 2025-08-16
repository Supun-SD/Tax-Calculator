import { Account } from './account';
import { Bank } from './bank';

export interface Calculation {
  id: number;
  dateAndTime: Date;
  year: string;
  account: Account;
  calculationData: CalculationData;
  status: 'submitted' | 'draft';
}

interface CalculationData {
  personalRelief: number;
  rentReliefRate: number;
  solarRelief: number;
  aitOnRentRate: number;
  aitOnInterestRate: number;
  appitRate: number;

  sourceOfIncome: SourceOfIncome;
  
  assessableIncome: number;
  taxableIncome: number;
  grossIncomeTax: GrossIncomeTax;
  qrt: Qrt;

  totalPayableTax: number;
  balancePayableTax: number;
}

interface SourceOfIncome {
  employmentIncome : EmploymentIncome,
  rentalIncome : RentalIncome,
  interestIncome : InterestIncome,
  dividendIncome : DividendIncome,
  businessIncome : BusinessIncome,
  otherIncome : OtherIncome,
  total : number;
}

interface EmploymentIncome {
  total : number;
  appitTotal: number;
  incomes : Array<EmploymentIncomeRecord>
}

interface EmploymentIncomeRecord {
  name: string;
  value : number;
  repetition : number;
  appit: number;
  total : number;
}

interface RentalIncome {
  total : number;
  incomes : Array<RentalIncomeRecord>
}

interface RentalIncomeRecord {
  name: string;
  value : number;
  repetition : number;
  total : number;
}

interface InterestIncome {
  totalGrossInterest : number;
  totalAit : number;
  incomes : Array<InterestIncomeRecord>;
}

interface InterestIncomeRecord {
  bank: Bank;
  accountNumber?: string;
  certificateNumber?: string;
  isJoint: boolean;
  grossInterest: number;
  ait: number;
}

interface DividendIncome {
  totalGrossDividend: number;
  totalAit: number;
  totalExempted: number;
  incomes: DividendIncomeRecord[];
}

interface DividendIncomeRecord {
  companyName: string;
  grossDividend: number;
  rate: number;
  ait: number;
  exempted: number;
}

interface BusinessIncome {
  total : number;
  professionalPracticeTotal: number;
  incomes : Array<BusinessIncomeRecord>;
  taxableIncomePercentage : number;
}

interface BusinessIncomeRecord {
  hospitalName: string;
  value : number;
  professionalPractice: number;
}

interface OtherIncome {
  total : number;
  incomes : Array<OtherIncomeRecord>;
}

interface OtherIncomeRecord {
  incomeType : string;
  value : number;
}

interface GrossIncomeTax {
  total : number;
  first: {
    value : number;
    rate : number;
    tax : number;
  },
  second: {
    value : number;
    rate : number;
    tax : number;
  },
  third: {
    value : number;
    rate : number;
    tax : number;
  },
  fourth: {
    value : number;
    rate : number;
    tax : number;
  },
  fifth: {
    value : number;
    rate : number;
    tax : number;
  }, 
  remaining : {
    value : number;
    rate : number;
    tax : number;
  }
}

interface Qrt {
  total: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
}