import { IpcMainInvokeEvent } from "electron";

import si from "systeminformation";
import wmi from "g";

const collectDataAndSendToRenderer = async (
    _event: IpcMainInvokeEvent,
    windowNumber: number | undefined
) => {
    if (windowNumber === undefined) {
        return undefined;
    }

    const data = getTemperatureAndUsageData();
    console.log(data);
    return {
        ...(await getGeneralSystemInformation()),
        memory: data.Data,
        load: data.Load,
        temperature: data.Temperature,
        windowNumber
    };
};

const getTemperatureAndUsageData = () => {
    let outerSortedByType;
    wmi.Query()
        .namespace("root\\OpenHardwareMonitor")
        .class("Sensor")
        .exec((_err, sensors) => {
            const sortedByType = sensors.reduce((acc, curr) => {
                if (curr.SensorType in acc) {
                    acc[curr.SensorType].push(curr);
                } else {
                    acc[curr.SensorType] = [curr];
                }
                return acc;
            }, {});
            outerSortedByType = sortedByType;
        });
    return outerSortedByType;
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
