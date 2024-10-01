// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Expose APIs if needed
});
