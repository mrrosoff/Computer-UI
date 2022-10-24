import { IpcMainInvokeEvent } from "electron";

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
    };
}

const collectSystemInformation = async (_event: IpcMainInvokeEvent): Promise<SystemInformation> => {
    const wantedInformation = { cpu: "brand", graphics: "controllers", osInfo: "distro" };
    return await si.get(wantedInformation);
};

export default collectSystemInformation;
