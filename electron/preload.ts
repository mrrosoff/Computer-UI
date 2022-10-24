import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcAPI", {
    getWindowNumber: () => ipcRenderer.invoke("getWindowNumber"),
    collectSystemInformation: () => ipcRenderer.invoke("collectSystemInformation"),
    collectLiveSystemData: () => ipcRenderer.invoke("collectLiveSystemData"),
    getCurrentlyPlayingGame: () => ipcRenderer.invoke("getCurrentlyPlayingGame"),
});
