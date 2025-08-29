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

const getHeaders = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

const getAllCalculations = async (token: string): Promise<CalculationOverview[]> => {
  const response = await axios.get(`${API_BASE_URL}/calculation`, getHeaders(token));
  return response.data.data;
}

const getCalculationById = async (id: number, token: string): Promise<Calculation> => {
  const response = await axios.get(`${API_BASE_URL}/calculation/${id}`, getHeaders(token));
  return response.data.data;
}

const createCalculation = async (calculation: CalculationReq, token: string): Promise<Calculation> => {
  const response = await axios.post(`${API_BASE_URL}/calculation`, calculation, getHeaders(token));
  return response.data.data;
}

const updateCalculation = async (id: number, calculation: CalculationReq, token: string): Promise<Calculation> => {
  const response = await axios.put(`${API_BASE_URL}/calculation/${id}`, calculation, getHeaders(token));
  return response.data.data;
}

const deleteCalculation = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/calculation/${id}`, getHeaders(token));
}

const getCalculationByAccountId = async (accountId: number, token: string): Promise<Calculation[]> => {
  const response = await axios.get(`${API_BASE_URL}/calculation/account/${accountId}`, getHeaders(token));
  return response.data.data;
}

export const downloadCalculationPdf = async (id: number, token: string): Promise<void> => {
  const response = await axios.get(`${API_BASE_URL}/calculation/print/${id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const contentDisposition = response.headers["content-disposition"];
  console.log('Content-Disposition:', contentDisposition);
  let filename = `calculation_${id}.pdf`;

  if (contentDisposition) {
    const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^"]+)/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
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