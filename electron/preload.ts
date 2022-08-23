import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcAPI", {
    getWindowNumber: () => ipcRenderer.invoke("getWindowNumber"),
    getSystemData: (windowNumber: number | undefined) => ipcRenderer.invoke("getSystemData", windowNumber)
});
