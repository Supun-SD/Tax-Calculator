import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { HIDE_MENUBAR } from '../renderer/config/api';

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

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
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

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: `A new version (${info.version}) is available. Downloading now...`,
  });
});

autoUpdater.on('update-downloaded', async () => {
  const result = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Restart', 'Later'],
    defaultId: 0,
    cancelId: 1,
    title: 'Update ready',
    message: 'The update has been downloaded. Do you want to install it now?',
  });

  if (result === 0) {
    autoUpdater.quitAndInstall();
  }
});

