// preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  registerComplete: (data) => ipcRenderer.send('registration-complete', data),
});
