import { IpcMainInvokeEvent } from "electron";

import { windows } from "../main";

const getWindowNumber = (event: IpcMainInvokeEvent) => {
    return windows.find(
        (windowInformation) => windowInformation.window.webContents.id === event.sender.id
    )?.windowNumber;
};

export default getWindowNumber;