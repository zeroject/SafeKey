// main.js
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';

// Add this to enable auto-reload during development
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

let mainWindow;
let registerWindow;

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Disable Node.js integration in renderer
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null); // Hide default menu
  // Uncomment to open DevTools for debugging
  // win.webContents.openDevTools();
}

function createRegisterWindow() {
  registerWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    modal: true,
    show: false,
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  registerWindow.loadFile('register.html');

  registerWindow.once('ready-to-show', () => {
    registerWindow.show();
  });

  registerWindow.on('closed', () => {
    registerWindow = null;
  });
}

app.whenReady().then(() => {
  // Check if the app has been registered
  const isRegistered = store.get('isRegistered', false);

  if (isRegistered) {
    createMainWindow();
  } else {
    createMainWindow();
    createRegisterWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (store.get('isRegistered', false)) {
        createMainWindow();
      } else {
        createMainWindow();
        createRegisterWindow();
      }
    }
  });
});

ipcMain.on('registration-complete', (event, data) => {
  // You can process registration data here if needed

  // Set the flag to indicate registration is complete
  store.set('isRegistered', true);

  // Close the registration window
  if (registerWindow) {
    registerWindow.close();
  }

  // Optionally, show the main window if it was hidden
  if (mainWindow) {
    mainWindow.show();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
