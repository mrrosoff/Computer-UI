import { app, ipcMain, screen, BrowserWindow, IpcMainInvokeEvent } from "electron";
import path from "path";

import getDisplayNumber from "./api/getWindowNumber";
import collectSystemInformation from "./api/collectSystemInformation";
import collectLiveSystemData from "./api/collectLiveSystemData";

interface WindowInformation {
    window: BrowserWindow;
    windowNumber: number;
}

export const windows: WindowInformation[] = [];

const createWindows = () => {
    const options: Electron.BrowserWindowConstructorOptions = {
        show: false,
        darkTheme: true,
        autoHideMenuBar: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    };

    const numberOfDisplays = getSmallDisplays().length;
    for (let i = 0; i < numberOfDisplays; i++) {
        const window = new BrowserWindow(options);
        const indexPath =
            process.env.NODE_ENV?.trim() === "production"
                ? `file://${path.join(__dirname, "..", "index.html")}`
                : "http://localhost:3000";

        setupWindow(window, i, indexPath);
        windows.push({ window, windowNumber: i + 1 });
    }
};

const getSmallDisplays = () => {
    const displays = screen.getAllDisplays();
    return displays.filter((display) => display.size.width < 1080);
};

const setupWindow = (window, displayNumber, indexPath) => {
    const second = 1000;
    window.loadURL(indexPath);
    window.once("ready-to-show", () => {
        window.show();

        if (process.env.NODE_ENV?.trim() === "production") {
            setTimeout(() => {
                window.setBounds(displayFromDisplayNumber(displayNumber).workArea);
            }, second);
            setTimeout(() => {
                window.setFullScreen(true);
            }, second * 2);
        }
    });
    window.on("closed", () => (window = null));
};

const displayFromDisplayNumber = (displayNumber) => {
    const displays = screen.getAllDisplays();
    return (
        displays.find(
            (display) => display.size.height === displayHeightFromDisplayNumber(displayNumber)
        ) || displays[0]
    );
};

const displayHeightFromDisplayNumber = (displayNumber) => {
    switch (displayNumber) {
        case 0:
            return 480;
        case 1:
            return 600;
        default:
            throw new Error("Invalid display number");
    }
};

app.on("ready", async () => {
    ipcMain.handle("getWindowNumber", getDisplayNumber);
    ipcMain.handle("collectSystemInformation", collectSystemInformation);
    ipcMain.handle("collectLiveSystemData", collectLiveSystemData);
    createWindows();
});

// For sunrise and sunset times API. No SSL Certificate error.
app.commandLine.appendSwitch("ignore-certificate-errors");

app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (windows.length === 0) {
        createWindows();
    }
});
