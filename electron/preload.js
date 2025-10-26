const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (fileName, content, filters, encoding) => 
    ipcRenderer.invoke('save-file', { fileName, content, filters, encoding }),
  
  openFile: (filters) => 
    ipcRenderer.invoke('open-file', filters),
  
  isElectron: true,
});

console.log('Preload script carregado');

