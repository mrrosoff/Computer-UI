/// <reference types="vite/client" />

export {};

interface ImportMetaEnv {
    readonly VITE_LATITUDE: number;
    readonly VITE_LONGITUDE: number;
    readonly VITE_TIME_INTERVAL: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    interface Window {
        readonly ipcAPI: {
            getWindowNumber(): number;
            getSystemData(displayNumber: number | undefined): any;
        };
    }
}
