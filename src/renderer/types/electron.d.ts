export interface ElectronAPI {
  checkForUpdates: () => Promise<{
    success: boolean;
    updateAvailable?: boolean;
    error?: string;
  }>;
  downloadUpdate: () => Promise<{
    success: boolean;
    error?: string;
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
