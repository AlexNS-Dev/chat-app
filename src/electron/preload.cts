import { contextBridge, ipcRenderer } from 'electron';

// Usar INVOKE cuando se requiere una respuesta y SEND cuando no se requiere respuesta
const customAPI = {
    // Tests para explicar a Josep
    doThing: (msg: string) => ipcRenderer.send('do-a-thing', msg),
    promiseMsg: (msg: string) => ipcRenderer.invoke('promise-msg', msg),

    // Controles de ventana
    windowControls: {
        minimize: () => ipcRenderer.send('minimize'),
        onWindowMaximized: (callback: (isMaximized: boolean) => void) => {
            ipcRenderer.on('window-maximized', (_event, isMaximized) => {
                callback(isMaximized);
            });
        },
        toggleMaximize: () => ipcRenderer.send('maximize'),
        close: () => ipcRenderer.send('close'),
    },
}

contextBridge.exposeInMainWorld('electronAPI', customAPI)