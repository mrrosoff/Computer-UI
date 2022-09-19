import { IpcMainInvokeEvent } from "electron";

import si from "systeminformation";

const collectSystemInformation = async (_event: IpcMainInvokeEvent) => {
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

export default collectSystemInformation;
