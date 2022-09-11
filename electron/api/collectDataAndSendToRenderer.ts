import { IpcMainInvokeEvent } from "electron";

import si from "systeminformation";
import WMI from "../wmi";

const collectDataAndSendToRenderer = async (
    _event: IpcMainInvokeEvent,
    windowNumber: number | undefined
) => {
    if (windowNumber === undefined) {
        return undefined;
    }

    const data = await getTemperatureAndUsageData();
    return {
        ...(await getGeneralSystemInformation()),
        memory: data.filter((item: any) => item.SensorType === "Data"),
        load: data.filter((item: any) => item.SensorType === "Load"),
        temperature: data.filter((item: any) => item.SensorType === "Temperature"),
        windowNumber
    };
};

const getTemperatureAndUsageData = async () => {
    const wmi = new WMI();
    wmi.setNamespace("root\\OpenHardwareMonitor");
    wmi.setClassName("Sensor");
    return await wmi.exec();
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

export default collectDataAndSendToRenderer;
