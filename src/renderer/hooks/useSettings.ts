import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../../types/settings';
import { settingsService } from '../services/settingsService';
import { useToast } from './useToast';

interface UseSettingsReturn {
    settings: Settings | null;
    loading: boolean;
    error: string | null;
    isUpdating: boolean;
    fetchSettingsByYear: (year: string) => Promise<void>;
    updateSettings: (settings: Settings) => Promise<Settings | null>;
    clearError: () => void;
}

export const useSettings = (): UseSettingsReturn => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showSuccess, showError } = useToast();

    const fetchSettingsByYear = useCallback(async (year: string) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedSettings = await settingsService.getSettingsByYear(year);
            setSettings(fetchedSettings);
        } catch (err: any) {
            let errorMessage = 'Error loading settings';
            
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

    const updateSettings = useCallback(async (settingsData: Settings): Promise<Settings | null> => {
        setIsUpdating(true);
        setError(null);
        try {
            const updatedSettings = await settingsService.updateSettings(settingsData);
            setSettings(updatedSettings);
            showSuccess('Settings updated successfully');
            return updatedSettings;
        } catch (err: any) {
            let errorMessage = 'Error updating settings';
            
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
            return null;
        } finally {
            setIsUpdating(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        settings,
        loading,
        error,
        isUpdating,
        fetchSettingsByYear,
        updateSettings,
        clearError
    }
}
