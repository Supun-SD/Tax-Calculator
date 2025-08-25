import axios from 'axios';
import { 
  CalculationOverview,
  Calculation,
  CalculationReq
} from '../../types/calculation';
import { API_BASE_URL } from '../config/api';

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
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(amount);
  }
}

const getAllCalculations = async (): Promise<CalculationOverview[]> => {
  const response = await axios.get(`${API_BASE_URL}/calculation`);
  return response.data.data;
}

const getCalculationById = async (id: number): Promise<Calculation> => {
  const response = await axios.get(`${API_BASE_URL}/calculation/${id}`);
  return response.data.data;
}

const createCalculation = async (calculation: CalculationReq): Promise<Calculation> => {
  const response = await axios.post(`${API_BASE_URL}/calculation`, calculation);
  return response.data.data;
}

const updateCalculation = async (id: number, calculation: CalculationReq): Promise<Calculation> => {
  const response = await axios.put(`${API_BASE_URL}/calculation/${id}`, calculation);
  return response.data.data;
}

const deleteCalculation = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/calculation/${id}`);
}

const getCalculationByAccountId = async (accountId: number): Promise<Calculation[]> => {
  const response = await axios.get(`${API_BASE_URL}/calculation/account/${accountId}`);
  return response.data.data;
}

export const downloadCalculationPdf = async (id: number): Promise<void> => {
  const response = await axios.get(`${API_BASE_URL}/calculation/print/${id}`, {
    responseType: "blob", 
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `calculation-${id}.pdf`;
  link.click();

  window.URL.revokeObjectURL(url);
};

export const calculationService = {
  getAllCalculations,
  getCalculationById,
  createCalculation,
  updateCalculation,
  deleteCalculation,
  getCalculationByAccountId,
  downloadCalculationPdf
}