import {app, BrowserWindow, ipcMain, shell} from 'electron';
import path from 'path';
import {fileURLToPath} from 'url';
import {spawn} from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Image Generator',
        icon: path.join(__dirname, 'icon.png')
    });

    // Express sunucusunu başlat
    startServer();

    // Sunucu başlayana kadar bekle, sonra yükle
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
    }, 2000);

    // DevTools'u kapat (isteğe bağlı)
    // mainWindow.webContents.openDevTools();
}

function startServer() {
    serverProcess = spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'inherit'
    });

    serverProcess.on('error', (err) => {
        console.error('Server başlatma hatası:', err);
    });
}

// Finder'da göster
ipcMain.handle('show-in-finder', async (event, filePath) => {
    const fullPath = path.join(__dirname, filePath.replace(/^\//, ''));
    shell.showItemInFolder(fullPath);
});

// Quick Look preview aç
ipcMain.handle('open-preview', async (event, filePath) => {
    const fullPath = path.join(__dirname, filePath.replace(/^\//, ''));
    await shell.openPath(fullPath);
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    // Server'ı kapat
    if (serverProcess) {
        serverProcess.kill();
    }

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});
