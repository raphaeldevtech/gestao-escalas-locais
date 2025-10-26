const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../dist/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
  });

  // Carregar o aplicativo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handler para salvar arquivos
ipcMain.handle('save-file', async (event, { fileName, content, filters, encoding }) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: fileName,
      filters: filters || [
        { name: 'Todos os arquivos', extensions: ['*'] }
      ]
    });

    if (filePath) {
      // Para PDFs, converter de base64 para buffer
      if (encoding === 'base64' || filePath.endsWith('.pdf')) {
        const buffer = Buffer.from(content, 'base64');
        fs.writeFileSync(filePath, buffer);
      } else {
        // Para texto (CSV, JSON, etc)
        fs.writeFileSync(filePath, content, 'utf8');
      }
      return { success: true, path: filePath };
    }
    return { success: false, canceled: true };
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    return { success: false, error: error.message };
  }
});

// Handler para abrir arquivos
ipcMain.handle('open-file', async (event, filters) => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: filters || [
        { name: 'Todos os arquivos', extensions: ['*'] }
      ]
    });

    if (filePaths && filePaths.length > 0) {
      const content = fs.readFileSync(filePaths[0], 'utf-8');
      return { success: true, content, path: filePaths[0] };
    }
    return { success: false, canceled: true };
  } catch (error) {
    console.error('Erro ao abrir arquivo:', error);
    return { success: false, error: error.message };
  }
});

// Log de informações
console.log('Electron App iniciado');
console.log('Versão do Electron:', process.versions.electron);
console.log('Versão do Node:', process.versions.node);
console.log('Versão do Chrome:', process.versions.chrome);

