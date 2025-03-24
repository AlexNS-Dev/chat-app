export interface ElectronAPI {
    doThing: (msg: string) => void
    promiseMsg: (msg: string) => Promise<string>

    windowControls: {
        minimize: () => void
        onWindowMaximized: (callback: (isMaximized: boolean) => void) => void
        toggleMaximize: () => void
        close: () => void
    }
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}