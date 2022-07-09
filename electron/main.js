const { app, screen, BrowserWindow } = require("electron");
const path = require("path");

const si = require("systeminformation");

let smallWindow;
let largeWindow;

async function collectDataAndSendToRenderer(window) {
    try {
        const result = {
            time: await si.time(),
            system: await si.system(),
            bios: await si.bios(),
            motherboard: await si.baseboard(),
            chassis: await si.chassis(),
            cpu: await si.cpu(),
            mem: await si.mem(),
            graphics: await si.graphics(),
            os: await si.osInfo(),
            load: await si.currentLoad(),
            fs: await si.fsSize(),
            usb: await si.usb(),
            audio: await si.audio(),
            network: await si.networkInterfaces(),
            wifi: await si.wifiNetworks(),
            bluetooth: await si.bluetoothDevices()
        };
        window.webContents.send("send-system-info", result);
    } catch (e) {
        console.log(e);
    }
}

function createWindow() {
    const displays = screen.getAllDisplays();
    const smallDisplay = displays.find((display) => display.size.height === 480);
    const largeDisplay = displays.find((display) => display.size.height === 600);

    const options = {
        icon: path.join(__dirname, "../src/template/icon.png"),
        show: false,
        darkTheme: true,
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            // preload: path.join(__dirname, "preload.js")
        }
    };

    smallWindow = new BrowserWindow(options);
    largeWindow = new BrowserWindow(options);

    let indexPath = "http://localhost:3000";
    if (process.env.NODE_ENV === "production") {
        indexPath = "file://" + path.join(__dirname, "..", "dist", "index.html");
    }

    smallWindow.loadURL(indexPath);
    largeWindow.loadURL(indexPath);

    const second = 1000;

    smallWindow.once("ready-to-show", () => {
        smallWindow.show();
        setTimeout(() => {
            smallWindow.setBounds(smallDisplay.workArea);
        }, second);

        setTimeout(() => {
            smallWindow.setFullScreen(true);
        }, second * 2);

        setTimeout(() => {
            collectDataAndSendToRenderer(smallWindow);
        }, second * 3);
    });
    largeWindow.once("ready-to-show", () => {
        largeWindow.show();
        setTimeout(() => {
            largeWindow.setBounds(largeDisplay.workArea);
        }, second);

        setTimeout(() => {
            largeWindow.setFullScreen(true);
        }, second * 2);

        setTimeout(() => {
            collectDataAndSendToRenderer(largeWindow);
        }, second * 3);
    });

    smallWindow.on("closed", () => (smallWindow = null));
    largeWindow.on("closed", () => (largeWindow = null));
}

app.on("ready", async () => createWindow());

app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (mainWindow === null) createWindow();
});
