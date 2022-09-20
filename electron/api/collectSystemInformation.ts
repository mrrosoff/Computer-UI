import { IpcMainInvokeEvent } from "electron";

import si from "systeminformation";

export interface SystemInformation {
    time: any;
    motherboard: {
        manufacturer: string;
        model: string;
    };
    cpu: {
        manufacturer: string;
        brand: string;
        cores: number;
        socket: string;
    };
    graphics: {
        controllers: {
            model: string;
        }[];
        displays: any;
    };
    osInfo: {
        distro: string;
        release: string;
        arch: string;
    };
    diskLayout: {
        device: string;
        name: string;
        type: string;
    };
}

const collectSystemInformation = async (_event: IpcMainInvokeEvent): Promise<SystemInformation> => {
    const wantedInformation = {
        time: "*",
        motherboard: "manufacturer, model",
        cpu: "manufacturer, brand, cores, socket",
        graphics: "controllers, displays",
        osInfo: "distro, release, arch",
        diskLayout: "device, name, type"
    };
    return await si.get(wantedInformation);
};

export default collectSystemInformation;
