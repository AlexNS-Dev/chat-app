import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { isDev } from './util.js'
import { getPreloadPath } from './pathResolver.js'

let mainWindow: BrowserWindow | null = null

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1260,
        height: 780,
        minWidth: 600,
        minHeight: 500,

        autoHideMenuBar: true, // (true) Oculta los tabs del menú
        resizable: true, // (true) permite el redimensionamiento de la ventana
        frame: false, // (false) Oculta el frame de la ventana
        fullscreenable: false, // (false) Bloquea la opción de pantalla completa

        webPreferences: {
            contextIsolation: true, // (true) Aisla el contexto de la ventana separandolo del proceso principal (React)
            nodeIntegration: false, // (false) Deshabilita la integración de Node.js en la ventana (evita vulnerabilidades como require() )
            preload: getPreloadPath(),
        },
    })

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123') // Carga la URL de localhost (desarrollo)
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html')) // Carga el archivo index.html (producción)
    }

    // When the window is maximized, send true to the renderer
    mainWindow.on('maximize', () => {
        mainWindow?.webContents.send('window-maximized', true);
    });

    // When the window is unmaximized, send false to the renderer
    mainWindow.on('unmaximize', () => {
        mainWindow?.webContents.send('window-maximized', false);
    });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// Test send
ipcMain.on('do-a-thing', (_event, msg) => {
    console.log(msg)
})
// Test invoke/handle
ipcMain.handle('promise-msg', async (_event, msg) => {
    console.log(msg, '->I\'m at the main process now<-')

    return `Platform: ${process.platform}`;
})

// Window Controls
ipcMain.on('minimize', () => mainWindow?.minimize())
ipcMain.on('maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow?.unmaximize()
        mainWindow?.center()
    } else {
        mainWindow?.maximize()
    }
})
ipcMain.on('close', () => mainWindow?.close())