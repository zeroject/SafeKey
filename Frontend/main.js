// main.js
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const ClientManager  = require('./ClientManager');

let mainWindow;
let clientManager = new ClientManager();

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

  clientManager.onClientReady = () => {
    // Send an IPC message when the client is ready
    mainWindow.webContents.send('client-ready'); // Notify renderer
};
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

ipcMain.handle('initClient', async () => {
  await clientManager.initClient();
});

ipcMain.handle('sendToBackend', (event, args) => {
  clientManager.onClientSendMsg(args);
});

ipcMain.handle('clientReady', (event, args) => {
  clientManager.onClientReady();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle graceful shutdown
app.on('before-quit', () => {
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});