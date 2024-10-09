// preload.js
const { contextBridge, ipcRenderer } = require('electron');
console.log('Preload is loaded');

contextBridge.exposeInMainWorld('api', {
  sendToBackend: (clientType, message) => ipcRenderer.invoke('sendToBackend', [clientType, message]),
  initClient: async () => {
    return await ipcRenderer.invoke('initClient')
  },
  ConnectedToBackend: (callback) => ipcRenderer.on('connected-to-backend', () => callback()),
  onClientReady: () => {
    ipcRenderer.addListener('client-ready'); // Listen for client-ready event
  },
  AskForData: (callback) => ipcRenderer.on('data-from-backend', () => callback()),
});
