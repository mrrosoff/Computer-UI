const { app, screen, BrowserWindow } = require("electron");
const path = require("path");

const si = require("systeminformation");

const windows = [];

const createWindows = () => {
    const options = {
        icon: path.join(__dirname, "../src/template/icon.png"),
        show: false,
        darkTheme: true,
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false
        }
    };

    const numberOfDisplays = 2;
    for (let i = 0; i < numberOfDisplays; i++) {
        const window = new BrowserWindow(options);
        let indexPath = "http://localhost:3000";
        if (process.env.NODE_ENV === "production") {
            indexPath = "file://" + path.join(__dirname, "..", "dist", "index.html");
        }
        setupWindow(window, i, indexPath);
        windows.push(window);
    }
};

const setupWindow = (window, displayNumber, indexPath) => {
    const second = 1000;
    window.loadURL(indexPath);
    window.once("ready-to-show", () => {
        window.show();
        setTimeout(() => {
            window.setBounds(displayFromDisplayNumber(displayNumber).workArea);
        }, second);

        setTimeout(() => {
            window.setFullScreen(true);
        }, second * 2);

        setTimeout(() => {
            setInterval(() => collectDataAndSendToRenderer(window, displayNumber), second * 5);
        }, second * 3);
    });
    window.on("closed", () => (window = null));
};

const displayFromDisplayNumber = (displayNumber) => {
    const displays = screen.getAllDisplays();
    return displays.find(
        (display) => display.size.height === displayHeightFromDisplayNumber(displayNumber)
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

const collectDataAndSendToRenderer = async (window, displayNumber) => {
    try {
        const wantedInformation = {
            time: "*",
            motherboard: "manufacturer, model",
            cpu: "manufacturer, brand, cores, socket",
            cpuCurrentSpeed: "avg, min, max",
            cpuTemperature: "main",
            mem: "total, free, used",
            graphics: "controllers, displays",
            os: "distro, release, arch, ",
            fs: "device, name, type",
            wifiConnections: "ssid"
        };
        const data = await si.get(wantedInformation);
        window.webContents.send("send-system-info", { ...data, displayNumber });
    } catch (error) {}
};

app.on("ready", async () => createWindows());
app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (windows.length == 0) createWindows();
});
