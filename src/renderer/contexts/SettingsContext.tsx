import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Settings, SettingsUpdateReq } from '../../types/settings';
import { settingsService } from '../services/settingsService';
import { useToast } from '../hooks/useToast';

interface SettingsContextType {
    settings: Settings | null;
    loading: boolean;
    error: string | null;
    isUpdating: boolean;
    currentYear: string;
    setCurrentYear: (year: string) => void;
    fetchSettingsByYear: (year: string) => Promise<void>;
    updateSettings: (settings: Settings) => Promise<Settings | null>;
    clearError: () => void;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentYear, setCurrentYear] = useState<string>('2024/2025'); // Default year
    const { showSuccess, showError } = useToast();

    const fetchSettingsByYear = async (year: string) => {
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
    };

    const updateSettings = async (settingsData: Settings): Promise<Settings | null> => {
        setIsUpdating(true);
        setError(null);

        const newSettings: SettingsUpdateReq = {
            year: settingsData.year,
            reliefsAndAit: settingsData.reliefsAndAit,
            taxRates: settingsData.taxRates
        }

        try {
            const updatedSettings = await settingsService.updateSettings(settingsData.id, newSettings);
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
    };

    const clearError = () => {
        setError(null);
    };

    const refreshSettings = async () => {
        await fetchSettingsByYear(currentYear);
    };

    // Fetch settings when the component mounts or when currentYear changes
    useEffect(() => {
        fetchSettingsByYear(currentYear);
    }, [currentYear]);

    const value: SettingsContextType = {
        settings,
        loading,
        error,
        isUpdating,
        currentYear,
        setCurrentYear,
        fetchSettingsByYear,
        updateSettings,
        clearError,
        refreshSettings
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
};
