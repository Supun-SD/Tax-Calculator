import { useState, useEffect, useCallback } from 'react';
import { Calculation, CalculationOverview, CalculationReq } from '../../types/calculation';
import { calculationService } from '../services/calculationService';
import { useToast } from './useToast';

interface UseCalculationsReturn {
  calculations: CalculationOverview[];
  loading: boolean;
  error: string | null;
  isDeleting: boolean;
  isSubmitting: boolean;
  isDraftSaving: boolean;
  isDownloading: boolean;
  fetchCalculations: () => Promise<void>;
  getCalculationById: (id: number) => Promise<Calculation | null>;
  createCalculation: (calculation: CalculationReq) => Promise<Calculation | null>;
  updateCalculation: (id: number, calculation: CalculationReq) => Promise<Calculation | null>;
  deleteCalculation: (id: number) => Promise<boolean>;
  getCalculationsByAccountId: (accountId: number) => Promise<Calculation[] | null>;
  clearError: () => void;
  downloadCalculationPdf: (id: number) => Promise<void>;
}

export const  useCalculations = (): UseCalculationsReturn => {
  const [calculations, setCalculations] = useState<CalculationOverview[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchCalculations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCalculations = await calculationService.getAllCalculations();
      setCalculations(fetchedCalculations);
    } catch (err: any) {
      let errorMessage = 'Error loading calculations';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCalculationById = useCallback(async (id: number): Promise<Calculation | null> => {
    setLoading(true);
    setError(null);
    try {
      const calculation = await calculationService.getCalculationById(id);
      return calculation;
    } catch (err: any) {
      let errorMessage = 'Error loading calculation';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCalculation = useCallback(async (calculation: CalculationReq): Promise<Calculation | null> => {
    if(calculation.status === 'draft') {
      setIsDraftSaving(true);
    } else {
      setIsSubmitting(true);
    }
    setError(null);
    try {
      const newCalculation = await calculationService.createCalculation(calculation);
      if(calculation.status === 'draft') {
        showSuccess('Draft saved successfully');
      } else {
        showSuccess('Calculation submitted successfully');
      }
      return newCalculation;
    } catch (err: any) {
      let errorMessage = 'Error creating calculation';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
      return null;
    }
    finally {
      if(calculation.status === 'draft') {
        setIsDraftSaving(false);
      } else {
        setIsSubmitting(false);
      }
      setLoading(false);
    }
  }, []);

  const updateCalculation = useCallback(async (id: number, calculation: CalculationReq): Promise<Calculation | null> => {
    if(calculation.status === 'draft') {
      setIsDraftSaving(true);
    } else {
      setIsSubmitting(true);
    }
    setError(null);
    try {
      const updatedCalculation = await calculationService.updateCalculation(id, calculation);
      if(calculation.status === 'draft') {
        showSuccess('Draft saved successfully');
      } else {
        showSuccess('Calculation updated successfully');
      }
      return updatedCalculation;
    } catch (err: any) {
      let errorMessage = 'Error updating calculation';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      if(calculation.status === 'draft') {
        setIsDraftSaving(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, []);

  const deleteCalculation = useCallback(async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    try {
      await calculationService.deleteCalculation(id);
      setCalculations(prev => prev.filter(calculation => calculation.id !== id));
      showSuccess('Calculation deleted successfully');
      return true;
    } catch (err: any) {
      let errorMessage = 'Error deleting calculation';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const getCalculationsByAccountId = useCallback(async (accountId: number): Promise<Calculation[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const accountCalculations = await calculationService.getCalculationByAccountId(accountId);
      return accountCalculations;
    } catch (err: any) {
      let errorMessage = 'Error loading account calculations';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadCalculationPdf = useCallback(async (id: number): Promise<void> => {
    setIsDownloading(true);
    try {
      await calculationService.downloadCalculationPdf(id);
      showSuccess('Calculation downloaded successfully');
    } catch (err: any) {
      let errorMessage = "Error downloading calculation";
  
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
  }, []);

  return {
    calculations,
    loading,
    error,
    isDeleting,
    isSubmitting,
    isDraftSaving,
    isDownloading,
    fetchCalculations,
    getCalculationById,
    createCalculation,
    updateCalculation,
    deleteCalculation,
    getCalculationsByAccountId,
    clearError,
    downloadCalculationPdf
  };
};
