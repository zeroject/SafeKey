// main.js
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const ClientManager = require("./ClientManager");

let mainWindow;
let clientManager = new ClientManager();

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Disable Node.js integration in renderer
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null); // Hide default menu
  //mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

ipcMain.handle("initClient", async () => {
  await clientManager.initClient();
  console.log("Client initialized");
  mainWindow.webContents.send("connected-to-backend");
});

ipcMain.handle("register", async () => {
  let secret = await clientManager.initRegistarPipe();
  mainWindow.webContents.send("secret", secret);
});

ipcMain.handle("client-read", (event, args) => {});

ipcMain.handle("sendToBackend", (event, args) => {
  clientManager.onClientSendMsg(args[0], args[1]);
});

ipcMain.handle("send-new-entry", async (event, args) => {
  await clientManager.onClientSendMsg("encrypt", args[0]);
  await new Promise(resolve => setTimeout(resolve, 500));
  let data = await clientManager.initDecryptClient();
  mainWindow.webContents.send("data-from-backend", data);
});

ipcMain.on("login-success", async () => {
  await mainWindow.loadFile("mainWindow.html");
  let data = await clientManager.initDecryptClient();
  console.log("Data from backend:", data);
  mainWindow.webContents.send("data-from-backend", data);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Handle graceful shutdown
app.on("before-quit", () => {
  clientManager.closeAllClients();
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
