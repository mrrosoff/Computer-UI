import { IpcMainInvokeEvent } from "electron";
import si from "systeminformation";

import games from "../../games";
import { updateLedsForGameName } from "../rgbController";

export interface SystemInformation {
    processes: {
        list: any[];
    };
}

const getCurrentlyPlayingGame = async (_event: IpcMainInvokeEvent) => {
    const wantedInformation = { processes: "list" };
    const processList = (await si.get(wantedInformation)).processes.list;
    const processNameList = processList.map((process) => process.name);
    const game = games.find((game) => processNameList.includes(game.application));
    updateLedsForGameName(game);
    return game;
};

export default getCurrentlyPlayingGame;
