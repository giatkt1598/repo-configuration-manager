import isDev from 'electron-is-dev';
import { app, BrowserWindow } from 'electron';
import electronRemote from '@electron/remote/dist/src/main/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const gotTheLock = app.requestSingleInstanceLock();
let myWindow = null;
if (!gotTheLock) {
  app.quit();
}

app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
  if (myWindow) {
    if (myWindow.isMinimized()) myWindow.restore()
    myWindow.focus()
  }
})

electronRemote.initialize();
function createWindow() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Create the browser window.
  myWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
    },
  })
  electronRemote.enable(myWindow.webContents);

  myWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
