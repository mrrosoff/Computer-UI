const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    sendSystemInfo: (callback) => ipcRenderer.on("send-system-info", callback)
});
