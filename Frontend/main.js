// main.js
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import os from 'os';
import net from 'net';

// Add this to enable auto-reload during development
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

let mainWindow;
let registerWindow;
let client;

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
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
  mainWindow.webContents.openDevTools();
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
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Disable Node.js integration in renderer
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
  const pipeName = os.platform() === 'win32' ? '\\\\.\\pipe\\LoginPipe' : '/tmp/LoginPipe.sock';

  client = net.createConnection(pipeName, () => {
    console.log('Connected to backend with named pipes');
  });

  client.on('data', (data) => {
    console.log('Received from backend:', data.toString());
    // Forward data to renderer process
    mainWindow.webContents.send('backend-message', data.toString());
  });

  client.on('end', () => {
    console.log('Disconnected from backend');
  });

  client.on('error', (err) => {
    console.error('Pipe connection error:', err);
  });

  client.on('ready', () => {
    console.log('client is ready');
  });

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

ipcMain.on('renderer-message', (event, message) => {
  if (client && !client.destroyed) {
    console.log('Sending msg');
    client.write(message);
    console.log('Msg is send');
  } else {
    console.log('Cannot send message, pipe is not connected');
  }
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

// Handle graceful shutdown
app.on('before-quit', () => {
  if (client) {
    client.end(); // Gracefully close the connection
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});