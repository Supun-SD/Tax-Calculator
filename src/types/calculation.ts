import { Account } from './account';
import { Status } from './enums/status';
import { ReliefsAndAit, TaxRates } from './settings';

export interface Calculation {
  id: number;
  year: string;
  status: Status;
  accountId: number;
  account: Account;
  createdAt: string;
  updatedAt: string;
  calculationData: CalculationData;
}

export type CalculationReq = Omit<Calculation, "id" | "createdAt" | "updatedAt" | "account">;
export type CalculationOverview = Omit<Calculation, "calculationData">;

interface CalculationData {
  settings: CalculationSettings;
  sourceOfIncome: SourceOfIncome;
  deductionsFromAssessableIncome: DeductionsFromAssessableIncome;
  totalTaxableIncome: number;
  grossIncomeTax: GrossIncomeTax;
  totalPayableTax: number;
  balancePayableTax: BalancePayableTax;
}

export interface CalculationSettings {
  reliefsAndAit: ReliefsAndAit;
  taxRates: TaxRates;
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

interface DeductionsFromAssessableIncome {
  rentRelief: number;
  solarRelief: number;
}

export interface EmploymentIncome {
  total : number;
  apitTotal: number;
  incomes : Array<EmploymentIncomeRecord>
}

export interface EmploymentIncomeRecord {
  name: string;
  value : number;
  multiplier : number;
  total : number;
  apit: number;
}

export interface RentalIncome {
  total : number;
  incomes : Array<RentalIncomeRecord>
}

export interface RentalIncomeRecord {
  name: string;
  value : number;
  multiplier : number;
  total : number;
}

export interface InterestIncome {
  totalGrossInterest : number;
  totalAit : number;
  fdIncome: FdIncome;
  repoIncome: ReposIncome;
  unitTrustIncome: UnitTrustIncome;
  treasuryBillIncome: TreasuryBillIncome;
  tBondIncome: TBondIncome;
  debentureIncome: DebentureIncome;
}

export interface FdIncome {
  total: number;
  ait: number;
  incomes: Array<FdIncomeRecord>;
}

export interface FdIncomeRecord {
  bank: {
    name: string;
    tinNumber: string;
  };
  accountNumber?: string;
  certificateNumber?: string;
  isJoint: boolean;
  grossInterest: number;
  contribution: number; 
  ait: number;
}

export interface ReposIncome {
  total: number;
  ait: number;
  incomes: Array<ReposIncomeRecord>;
}

export interface ReposIncomeRecord {
  companyName: string;
  certificateNumber: string;
  value: number;
  ait: number;
}

export interface UnitTrustIncome {
  total: number;
  ait: number;
  incomes: Array<UnitTrustIncomeRecord>;
}

export interface UnitTrustIncomeRecord {
  companyName: string;
  certificateNumber: string;
  value: number;
  ait: number;
}

export interface TreasuryBillIncome {
  total: number;
  ait: number;
  incomes: Array<TreasuryBillIncomeRecord>;
}

export interface TreasuryBillIncomeRecord {
  companyName: string;
  certificateNumber: string;
  value: number;
  ait: number;
}

export interface TBondIncome {
  total: number;
  ait: number;
  incomes: Array<TBondIncomeRecord>;
}

export interface TBondIncomeRecord {
  companyName: string;
  certificateNumber: string;
  value: number;
  ait: number;
}

export interface DebentureIncome {
  total: number;
  ait: number;
  incomes: Array<DebentureIncomeRecord>;
}

export interface DebentureIncomeRecord {
  companyName: string;
  certificateNumber: string;
  value: number;
  ait: number;
}

export interface DividendIncome {
  totalGrossDividend: number;
  totalAit: number;
  totalExempted: number;
  incomes: Array<DividendIncomeRecord>;
}

export interface DividendIncomeRecord {
  companyName: string;
  grossDividend: number;
  rate: number;
  ait: number;
  exempted: number;
}

export interface BusinessIncome {
  total: number;
  professionalPracticeTotal: number;
  incomes: Array<BusinessIncomeRecord>;
  amountForAssessableIncome: number;
  assessableIncomePercentage: number;
}

export interface BusinessIncomeRecord {
  hospitalName: string;
  value : number;
  professionalPractice: number;
}

export interface OtherIncome {
  total : number;
  incomes : Array<OtherIncomeRecord>;
}

export interface OtherIncomeRecord {
  incomeType : string;
  value : number;
}

export interface GrossIncomeTax {
  total: number;
  foreignIncome: {
    total: number;
    tax: number;
  };
  slabs: Array<GrossIncomeTaxSlab>;
}

export interface GrossIncomeTaxSlab {
  slab: string;
  value: number;
  rate: number;
  tax: number;
}

interface BalancePayableTax {
  total: number;
  quarterly: {
    one: number;
    two: number;
    three: number;
    four: number;
  };
}