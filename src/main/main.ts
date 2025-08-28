import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { HIDE_MENUBAR } from '../renderer/config/api';
import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';

autoUpdater.autoDownload = false; 
autoUpdater.autoInstallOnAppQuit = true; 

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'Supun-SD',
  repo: 'Tax-Calculator',
  private: false,
  releaseType: 'release'
});

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    resizable: true,
    height: 800,
    width: 1200,
    autoHideMenuBar: HIDE_MENUBAR,
    icon: path.join(__dirname, '../../public/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('check-for-updates', async () => {
  try {
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
      return { success: false, error: 'Updates not available in development mode' };
    }
    
    console.log('Checking for updates...');
    const result = await autoUpdater.checkForUpdates();
    console.log('Update check result:', result);
    
    return { success: true, updateAvailable: !!result };
  } catch (error) {
    console.error('Update check error:', error);
    
    if (error.message && error.message.includes('app-update.yml')) {
      return { success: false, error: 'No update configuration found. This is normal for first-time installations.' };
    }
    
    return { success: false, error: error.message || 'Failed to check for updates' };
  }
});

ipcMain.handle('download-update', async () => {
  try {
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
      return { success: false, error: 'Updates not available in development mode' };
    }
    
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error) {
    console.error('Update download error:', error);
    return { success: false, error: error.message || 'Failed to download update' };
  }
});

autoUpdater.on('checking-for-update', () => {
});

autoUpdater.on('update-available', () => {
});

autoUpdater.on('update-not-available', () => {
});

autoUpdater.on('error', (err) => {
  console.error('AutoUpdater error:', err);
  if (err.message && err.message.includes('app-update.yml')) {
    console.log('Update configuration not found - this is normal for first-time installations');
  }
});

autoUpdater.on('download-progress', (progressObj) => {
});

autoUpdater.on('update-downloaded', async () => {
  const result = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Restart now', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update ready',
    message: 'A new version has been downloaded. Do you want to restart now to install it?',
  });

  if (result === 0) {
    autoUpdater.quitAndInstall();
  }
});
