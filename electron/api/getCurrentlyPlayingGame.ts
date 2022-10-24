import { IpcMainInvokeEvent } from "electron";

import si from "systeminformation";

export interface SystemInformation {
    processes: {
        list: any[];
    };
}

const processNameToTitle = {
    "VALORANT-Win64-Shipping.exe": "Valorant",
    "League of Legends.exe": "League of Legends",
    "LeagueClient.exe": "(Client) League of Legends"
};

const getCurrentlyPlayingGame = async (_event: IpcMainInvokeEvent) => {
    const wantedInformation = { processes: "list" };
    const processList = (await si.get(wantedInformation)).processes.list;
    const interestedProcess = Object.keys(processNameToTitle).find(processName => processList.map(process => process.name).includes(processName));
    return interestedProcess && processNameToTitle[interestedProcess];
};

export default getCurrentlyPlayingGame;
