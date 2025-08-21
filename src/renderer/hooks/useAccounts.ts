import { useState, useEffect, useCallback } from 'react';
import { Account } from '../../types/account';
import { AccountCreateReq } from '../../types/AccountCreateReq';
import { AccountUpdateReq } from '../../types/AccountUpdateReq';
import { accountService } from '../services/accountService';
import { useToast } from './useToast';

interface UseAccountsReturn {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    isDeleting: boolean;
    fetchAccounts: () => Promise<void>;
    createAccount: (account: AccountCreateReq) => Promise<Account | null>;
    updateAccount: (id: number, account: AccountUpdateReq) => Promise<Account | null>;
    deleteAccount: (id: number) => Promise<boolean>;
    clearError: () => void;
}

export const useAccounts = (): UseAccountsReturn => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showSuccess, showError } = useToast();

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedAccounts = await accountService.getAllAccounts();
            setAccounts(fetchedAccounts);
        } catch (err: any) {
            let errorMessage = 'Error loading accounts';
            
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

    const createAccount = useCallback(async (account: AccountCreateReq): Promise<Account | null> => {
        setError(null);
        try {
            const newAccount = await accountService.createAccount(account);
            setAccounts(prev => [newAccount, ...prev]);
            showSuccess('Account created successfully');
            return newAccount;
        } catch (err: any) {
            let errorMessage = 'Error creating account';
            
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

    const updateAccount = useCallback(async (id: number, account: AccountUpdateReq): Promise<Account | null> => {
        setError(null);
        try {
            const updatedAccount = await accountService.updateAccount(id, account);
            setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc));
            showSuccess('Account updated successfully');
            return updatedAccount;
        } catch (err: any) {
            let errorMessage = 'Error updating account';
            
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

    const deleteAccount = useCallback(async (id: number): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);
        try {
            await accountService.deleteAccount(id);
            setAccounts(prev => prev.filter(acc => acc.id !== id));
            showSuccess('Account deleted successfully');
            return true;
        } catch (err: any) {
            let errorMessage = 'Error deleting account';
            
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

    useEffect(() => {
        fetchAccounts();
    }, []);

    return {
        accounts,
        loading,
        error,
        isDeleting,
        fetchAccounts,
        createAccount,
        updateAccount,
        deleteAccount,
        clearError
    }
}