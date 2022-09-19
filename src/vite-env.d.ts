/// <reference types="vite/client" />

export {};

interface ImportMetaEnv {
    readonly VITE_LATITUDE: number;
    readonly VITE_LONGITUDE: number;
    readonly VITE_API_SYNC_TIME_INTERVAL: number;
    readonly VITE_SYSTEM_SYNC_TIME_INTERVAL: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    interface Window {
        readonly ipcAPI: {
            getWindowNumber(): number;
            collectSystemInformation(): any;
            collectLiveSystemData(): any;
        };
    }
}
