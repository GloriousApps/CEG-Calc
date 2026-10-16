const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
  const window = new BrowserWindow({
    // Keep the first portable launch compact while leaving enough room for
    // the desktop two-column calculator layout.
    width: 920,
    height: 640,
    minWidth: 680,
    minHeight: 560,
    resizable: true,
    autoHideMenuBar: true,
    backgroundColor: '#0d141a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
