import { useState, useEffect, useCallback } from 'react';
import { Bank, BankCreateReq, BankUpdateReq } from '../../types/bank';
import { bankService } from '../services/bankService';
import { useToast } from './useToast';

interface UseBanksReturn {
  banks: Bank[];
  loading: boolean;
  error: string | null;
  isDeleting: boolean;
  fetchBanks: () => Promise<void>;
  createBank: (bank: BankCreateReq) => Promise<Bank | null>;
  updateBank: (id: number, bank: BankUpdateReq) => Promise<Bank | null>;
  deleteBank: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useBanks = (): UseBanksReturn => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchBanks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBanks = await bankService.getAllBanks();
      setBanks(fetchedBanks);
    } catch (err: any) {
      let errorMessage = 'Error loading banks';
      
      // Handle Axios error with response data
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

  const createBank = useCallback(async (bank: BankCreateReq): Promise<Bank | null> => {
    setError(null);
    try {
      const newBank = await bankService.createBank(bank);
      setBanks(prev => [newBank, ...prev]);
      showSuccess('Bank created successfully');
      return newBank;
    } catch (err: any) {
      console.log(err);
      let errorMessage = 'Error creating bank';
      
      // Handle Axios error with response data
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      errorMessage = errorMessage.replace("tinNumber", "TIN number");

      setError(errorMessage);
      showError(errorMessage);
      return null;
    }
  }, []);

  const updateBank = useCallback(async (id: number, bank: BankUpdateReq): Promise<Bank | null> => {
    setError(null);
    try {
      const updatedBank = await bankService.updateBank(id, bank);
      setBanks(prev => prev.map(b => b.id === id ? updatedBank : b));
      showSuccess('Bank updated successfully');
      return updatedBank;
    } catch (err: any) {
      let errorMessage = 'Error updating bank';
      
      // Handle Axios error with response data
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data) {
        errorMessage = err.response.data;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      errorMessage = errorMessage.replace("tinNumber", "TIN number");
      
      setError(errorMessage);
      showError(errorMessage);
      return null;
    }
  }, []);

  const deleteBank = useCallback(async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    try {
      await bankService.deleteBank(id);
      setBanks(prev => prev.filter(bank => bank.id !== id));
      showSuccess('Bank deleted successfully');
      return true;
    } catch (err: any) {
      let errorMessage = 'Error deleting bank';
      
      // Handle Axios error with response data
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, []);

  return {
    banks,
    loading,
    error,
    isDeleting,
    fetchBanks,
    createBank,
    updateBank,
    deleteBank,
    clearError,
  };
};
