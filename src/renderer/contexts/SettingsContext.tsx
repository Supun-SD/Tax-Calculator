import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Settings, SettingsUpdateReq } from "../../types/settings";
import { settingsService } from "../services/settingsService";
import { useToast } from "../hooks/useToast";
import { useUserContext } from "./UserContext";

interface SettingsContextType {
  settings: Settings | null;
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  error: string | null;
  isUpdating: boolean;
  updateSettings: (settings: Settings) => Promise<Settings | null>;
  clearError: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showSuccess, showError } = useToast();
  const { token, user } = useUserContext();

  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings);
    } else {
      setSettings(null);
    }
  }, [user]);

  const updateSettings = async (
    settingsData: Settings
  ): Promise<Settings | null> => {
    setIsUpdating(true);
    setError(null);

    const newSettings: SettingsUpdateReq = {
      reliefsAndAit: settingsData.reliefsAndAit,
      taxRates: settingsData.taxRates,
    };

    try {
      const updatedSettings = await settingsService.updateSettings(
        settingsData.id,
        newSettings,
        token
      );
      setSettings(updatedSettings);
      showSuccess("Settings updated successfully");
      return updatedSettings;
    } catch (err: any) {
      let errorMessage = "Error updating settings";

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

  const value: SettingsContextType = {
    settings,
    setSettings,
    error,
    isUpdating,
    updateSettings,
    clearError,
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
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider"
    );
  }
  return context;
};
