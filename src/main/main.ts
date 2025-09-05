import { app, BrowserWindow, dialog } from 'electron';
// import { autoUpdater } from 'electron-updater';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { HIDE_MENUBAR } from '../renderer/config/api';

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let progressWindow: BrowserWindow | null = null;

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

// const createProgressWindow = () => {
//   progressWindow = new BrowserWindow({
//     width: 400,
//     height: 200,
//     resizable: false,
//     minimizable: true,
//     maximizable: false,
//     closable: true,
//     alwaysOnTop: true,
//     modal: true,
//     parent: mainWindow || undefined,
//     autoHideMenuBar: true,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   });

//   const progressHtmlPath = path.join(__dirname, '../../public/progress-window.html');
//   progressWindow.loadFile(progressHtmlPath);
  
//   if (mainWindow) {
//     mainWindow.setEnabled(false);
//   }

//   progressWindow.on('closed', () => {
//     progressWindow = null;
//     if (mainWindow) {
//       mainWindow.close();
//       mainWindow = null;
//     }
//   });
// };

// const closeProgressWindow = () => {
//   if (progressWindow) {
//     progressWindow.close();
//     progressWindow = null;
//   }
//   if (mainWindow) {
//     mainWindow.setEnabled(true);
//   }
// };

app.on('ready', () => {
  createWindow();
  mainWindow.maximize();
  // autoUpdater.autoDownload = false; 
  // autoUpdater.autoInstallOnAppQuit = true;
  // autoUpdater.checkForUpdates();
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

// autoUpdater.on('update-available', async (info) => {
//   if (mainWindow) {
//     mainWindow.setEnabled(false);
//   }

//   const result = await dialog.showMessageBox(mainWindow!, {
//     type: 'question',
//     buttons: ['Download', 'Close App'],
//     defaultId: 0,
//     cancelId: 1,
//     title: 'Update available',
//     message: `A new version (${info.version}) is available.\n\nSize: ${(info.files[0].size / (1024*1024)).toFixed(2)} MB\n\nDo you want to download it now?`,
//     noLink: true,
//     normalizeAccessKeys: true,
//   });

//   if (mainWindow) {
//     mainWindow.setEnabled(true);
//     mainWindow.focus();
//   }

//   if (result.response === 0) {
//     createProgressWindow();
//     autoUpdater.downloadUpdate();
//   } else {
//     app.quit();
//   }
// });

// autoUpdater.on('download-progress', (progress) => {
//   if (mainWindow) {
//     mainWindow.setProgressBar(progress.percent / 100); 
//   }
  
//   if (progressWindow) {
//     progressWindow.webContents.executeJavaScript(`
//       if (window.updateProgress) {
//         window.updateProgress(${progress.percent}, ${progress.bytesPerSecond}, ${progress.transferred}, ${progress.total});
//       }
//     `);
//   }
// });

// autoUpdater.on('update-downloaded', async () => {
  
//   closeProgressWindow();
//   if (mainWindow) mainWindow.setProgressBar(-1); 

//   if (mainWindow) {
//     mainWindow.setEnabled(false);
//   }

//   const result = await dialog.showMessageBox(mainWindow!, {
//     type: 'question',
//     buttons: ['Install and Restart'],
//     defaultId: 0,
//     cancelId: 1,
//     title: 'Update ready',
//     message: 'The update has been downloaded successfully. Do you want to install it now?',
//     noLink: true,
//     normalizeAccessKeys: true,
//   });

//   if (mainWindow) {
//     mainWindow.setEnabled(true);
//     mainWindow.focus();
//   }

//   if (result.response === 0) {
//     autoUpdater.quitAndInstall();
//   }
// });


// autoUpdater.on('error', (error) => {
//   closeProgressWindow();
  
//   dialog.showErrorBox('Update Error', 
//     `Failed to download update: ${error.message}\n\nPlease try again later.`
//   );

//   if (mainWindow) {
//     mainWindow.setEnabled(true);
//   }
// });


// autoUpdater.on('update-cancelled', () => {
//   closeProgressWindow();
// });