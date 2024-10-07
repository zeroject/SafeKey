// preload.js
const { contextBridge, ipcRenderer } = require('electron');
console.log('Preload is loaded');

contextBridge.exposeInMainWorld('api', {
  sendToBackend: (message) => ipcRenderer.invoke('sendToBackend', message),
  initClient: async () => {
    return await ipcRenderer.invoke('initClient')
  },
  onClientReady: (callback) => {
    ipcRenderer.on('client-ready', callback); // Listen for client-ready event
  },
});
