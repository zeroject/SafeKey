// main.js
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Add this to enable auto-reload during development
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    // Add any other extensions you want to watch (e.g., CSS, HTML)
    // Specifying 'ignored' option will avoid unnecessary reloads
    ignored: /node_modules|[\/\\]\./
  });

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Disable Node.js integration in renderer
    }
  });

  win.loadFile('index.html');

  Menu.setApplicationMenu(null); // Hide default menu
  // Uncomment to open DevTools for debugging
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
