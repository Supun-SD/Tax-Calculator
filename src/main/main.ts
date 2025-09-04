import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { HIDE_MENUBAR } from '../renderer/config/api';

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
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

app.on('ready', () => {
  createWindow();
  autoUpdater.autoDownload = false; 
  autoUpdater.checkForUpdates();
});

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

autoUpdater.on('update-available', async (info) => {
  const result = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Download', 'Close App'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update available',
    message: `A new version (${info.version}) is available.\n\nSize: ${(info.files[0].size / (1024*1024)).toFixed(2)} MB\n\nDo you want to download it now?`,
  });

  if (result.response === 0) {
    autoUpdater.downloadUpdate();
  } else {
    app.quit();
  }
});

autoUpdater.on('download-progress', (progress) => {
  if (mainWindow) {
    mainWindow.setProgressBar(progress.percent / 100); 
  }
});

autoUpdater.on('update-downloaded', async () => {
  if (mainWindow) mainWindow.setProgressBar(-1); 

  const result = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Restart', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update ready',
    message: 'The update has been downloaded. Do you want to install it now?',
  });

  if (result.response === 0) {
    autoUpdater.quitAndInstall();
  }
});
