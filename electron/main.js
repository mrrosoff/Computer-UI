const { app, screen, BrowserWindow } = require("electron");
const path = require("path");

const si = require("systeminformation");
const wmi = require("node-wmi");

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
            setInterval(() => collectDataAndSendToRenderer(window, displayNumber), second);
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
    const compileData = async (openHardwareData) => {
        try {
            window.webContents.send("send-system-info", {
                ...(await getGeneralSystemInformation()),
                memory: openHardwareData.Data,
                load: openHardwareData.Load,
                temperature: openHardwareData.Temperature,
                displayNumber
            });
        } catch (error) {}
    };
    getTemperatureAndUsageData((openHardwareData) => compileData(openHardwareData));
};

const getGeneralSystemInformation = async () => {
    try {
        const wantedInformation = {
            time: "*",
            motherboard: "manufacturer, model",
            cpu: "manufacturer, brand, cores, socket",
            graphics: "controllers, displays",
            osInfo: "distro, release, arch",
            diskLayout: "device, name, type"
        };
        return await si.get(wantedInformation);
    } catch (error) {}
};

const getTemperatureAndUsageData = (callback) => {
    wmi.Query()
        .namespace("root\\OpenHardwareMonitor")
        .class("Sensor")
        .exec((err, sensors) => {
            const sortedByType = sensors.reduce((acc, curr) => {
                if (curr.SensorType in acc) {
                    acc[curr.SensorType].push(curr);
                } else {
                    acc[curr.SensorType] = [curr];
                }
                return acc;
            }, {});
            callback(sortedByType);
        });
};

app.on("ready", async () => createWindows());
app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
    if (windows.length == 0) createWindows();
});
