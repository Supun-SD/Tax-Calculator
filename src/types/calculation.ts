import { Account } from './account';
import { Bank } from './bank';
import { Status } from './enums/status';

export interface Calculation {
  id: number;
  year: string;
  status: Status;
  account: Account;
  calculationData: CalculationData;
}

interface CalculationData {
  sourceOfIncome: SourceOfIncome;
  deductionsFromAssessableIncome: DeductionsFromAssessableIncome;
  totalTaxableIncome: number;
}

interface DeductionsFromAssessableIncome {
  personalRelief: number;
  rentReliefRate: number;
  rentRelief: number;
  solarRelief: number;
}

interface SourceOfIncome {
  employmentIncome : EmploymentIncome,
  rentalIncome : RentalIncome,
  interestIncome : InterestIncome,
  dividendIncome : DividendIncome,
  businessIncome : BusinessIncome,
  otherIncome : OtherIncome,
  totalAssessableIncome : number;
}

export interface EmploymentIncome {
  total : number;
  appitTotal: number;
  incomes : Array<EmploymentIncomeRecord>
}

interface EmploymentIncomeRecord {
  name: string;
  value : number;
  multiplier : number;
  appit: number;
  total : number;
}

export interface RentalIncome {
  total : number;
  incomes : Array<RentalIncomeRecord>
}

interface RentalIncomeRecord {
  name: string;
  value : number;
  multiplier : number;
  total : number;
}

export interface InterestIncome {
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
  contribution: number; 
  ait: number;
}

export interface DividendIncome {
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

export interface BusinessIncome {
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

export interface OtherIncome {
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