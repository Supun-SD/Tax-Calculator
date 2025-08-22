import { 
  EmploymentIncome, 
  RentalIncome, 
  InterestIncome, 
  DividendIncome, 
  BusinessIncome, 
  OtherIncome 
} from '../../types/calculation';
import { Settings } from '../../types/settings';

export interface IncomeData {
  employmentIncome?: EmploymentIncome;
  rentalIncome?: RentalIncome;
  interestIncome?: InterestIncome;
  dividendIncome?: DividendIncome;
  businessIncome?: BusinessIncome;
  otherIncome?: OtherIncome;
  solarRelief?: number;
}

export interface CalculationResult {
  assessableIncome: number;
  totalTaxableIncome: number;
  breakdown: {
    employmentIncome: number;
    rentalIncome: number;
    interestIncome: number;
    dividendIncome: number;
    businessIncome: number;
    otherIncome: number;
    personalRelief: number;
    rentRelief: number;
    solarRelief: number;
  };
}

export class CalculationService {
  /**
   * Convert string to number safely, returning 0 for invalid values
   */
  static toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    if (typeof value === 'number') {
      return value;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Round a number to 2 decimal places
   */
  static roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Round a number to whole number (for percentages)
   */
  static roundToWhole(value: number): number {
    return Math.round(value);
  }

  /**
   * Safely parse and round a string number to 2 decimal places
   */
  static parseAndRound(value: string | number | null | undefined): number {
    return this.roundToTwoDecimals(this.toNumber(value));
  }

  /**
   * Safely parse and round a string number to whole number
   */
  static parseAndRoundWhole(value: string | number | null | undefined): number {
    return this.roundToWhole(this.toNumber(value));
  }

  /**
   * Format percentage for display (whole numbers only)
   */
  static formatPercentage(value: number): string {
    return this.roundToWhole(value).toString();
  }

  /**
   * Calculate total assessable income from all income sources
   */
  static calculateAssessableIncome(incomeData: IncomeData): number {
    const employmentIncome = incomeData.employmentIncome?.total || 0;
    const rentalIncome = incomeData.rentalIncome?.total || 0;
    const interestIncome = incomeData.interestIncome?.totalGrossInterest || 0;
    const dividendIncome = incomeData.dividendIncome?.totalGrossDividend || 0;
    
    // Business income calculation with taxable percentage
    const businessIncome = incomeData.businessIncome?.total || 0;
    const taxablePercentage = incomeData.businessIncome?.taxableIncomePercentage || 0;
    const taxableBusinessIncome = (businessIncome * taxablePercentage) / 100;
    
    const otherIncome = incomeData.otherIncome?.total || 0;

    const result = employmentIncome + rentalIncome + interestIncome + dividendIncome + taxableBusinessIncome + otherIncome;
    return this.roundToTwoDecimals(result);
  }

  /**
   * Calculate total taxable income after deductions
   */
  static calculateTotalTaxableIncome(
    incomeData: IncomeData, 
    settings: Settings
  ): CalculationResult {
    // Calculate assessable income
    const assessableIncome = this.calculateAssessableIncome(incomeData);

    // Get reliefs from settings
    const personalRelief = settings.reliefsAndAit.personalRelief;
    const rentReliefRate = settings.reliefsAndAit.rentRelief;
    
    // Calculate rent relief based on rental income
    const rentalIncome = incomeData.rentalIncome?.total || 0;
    const rentRelief = this.roundToTwoDecimals((rentalIncome * rentReliefRate) / 100);
    
    // Get solar relief from income data
    const solarRelief = incomeData.solarRelief || 0;
    
    // Calculate total taxable income
    const totalTaxableIncome = assessableIncome - personalRelief - solarRelief - rentRelief;
    const finalTaxableIncome = Math.max(0, totalTaxableIncome); // Ensure non-negative

    return {
      assessableIncome: this.roundToTwoDecimals(assessableIncome),
      totalTaxableIncome: this.roundToTwoDecimals(finalTaxableIncome),
      breakdown: {
        employmentIncome: this.roundToTwoDecimals(incomeData.employmentIncome?.total || 0),
        rentalIncome: this.roundToTwoDecimals(incomeData.rentalIncome?.total || 0),
        interestIncome: this.roundToTwoDecimals(incomeData.interestIncome?.totalGrossInterest || 0),
        dividendIncome: this.roundToTwoDecimals(incomeData.dividendIncome?.totalGrossDividend || 0),
        businessIncome: this.roundToTwoDecimals(incomeData.businessIncome?.total || 0),
        otherIncome: this.roundToTwoDecimals(incomeData.otherIncome?.total || 0),
        personalRelief: this.roundToTwoDecimals(personalRelief),
        rentRelief: this.roundToTwoDecimals(rentRelief),
        solarRelief: this.roundToTwoDecimals(solarRelief)
      }
    };
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(amount);
  }
}
