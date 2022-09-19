import { IpcMainInvokeEvent } from "electron";

import WMI from "../wmi";

const collectLiveSystemData = async (_event: IpcMainInvokeEvent) => {
    const data = await getTemperatureAndUsageData();
    return {
        memory: data.filter((item: any) => item.SensorType === "Data"),
        load: data.filter((item: any) => item.SensorType === "Load"),
        temperature: data.filter((item: any) => item.SensorType === "Temperature")
    };
};

const getTemperatureAndUsageData = async () => {
    const wmi = new WMI();
    wmi.setNamespace("root\\OpenHardwareMonitor");
    wmi.setClassName("Sensor");
    return await wmi.exec();
};

export default collectLiveSystemData;
