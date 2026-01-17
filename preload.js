const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    showInFinder: (filePath) => ipcRenderer.invoke('show-in-finder', filePath),
    openPreview: (filePath) => ipcRenderer.invoke('open-preview', filePath)
});
