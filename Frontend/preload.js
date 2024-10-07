// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload is loaded');

contextBridge.exposeInMainWorld('api', {
  registerComplete: (data) => ipcRenderer.send('registration-complete', data),
  sendToBackend: (message) => ipcRenderer.send('renderer-message', message),
  onBackendMessage: (callback) => ipcRenderer.on('backend-message', (event, data) => callback(data)),
});
