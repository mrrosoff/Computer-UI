import { IpcMainInvokeEvent } from "electron";

import os from "os";
import si from "systeminformation";

export interface SystemInformation {
    cpu: {
        brand: string;
    };
    graphics: {
        controllers: {
            model: string;
        }[];
    };
    osInfo: {
        distro: string;
        hostName: string;
    };
    users: {
        user: string;
    }[];
}

const collectSystemInformation = async (_event: IpcMainInvokeEvent): Promise<SystemInformation> => {
    const wantedInformation = {
        cpu: "brand",
        graphics: "controllers",
        osInfo: "distro",
        users: "user"
    };
    const systemInformation = await si.get(wantedInformation);
    const hostName = os.hostname();
    return { ...systemInformation, osInfo: { ...systemInformation.osInfo, hostName } };
};

export default collectSystemInformation;
