import { Client as RGBClient, utils } from "openrgb-sdk";

import { Game } from "../games";

let client;

export const startRGBController = async () => {
    client = new RGBClient("RGBController", 6742, "localhost");
    await client.connect();
};

export const updateLedsForGameName = async (game: Game | undefined) => {
    const controllerCount = await client.getControllerCount();
    for (let deviceId = 0; deviceId < controllerCount; deviceId++) {
        const controllerData = await client.getControllerData(deviceId);
        const gameColor = getColorForGameName(game);
        await client.updateMode(deviceId, "Direct");
        await client.updateLeds(deviceId, Array(controllerData.colors.length).fill(gameColor));
    }
};

const getColorForGameName = (game: Game | undefined) => {
    if (!game || game.name.includes("Client")) {
        return utils.color(255, 255, 255);
    } else {
        return utils.hexColor(game.color);
    }
};

export async function closeRGBController() {
    await client.disconnect();
}
