import { Client as RGBClient, utils } from "openrgb-sdk";

import { Game } from "../games";
import Device from "openrgb-sdk/types/device";

const client = new RGBClient("RGBController", 6742, "localhost");

export const updateLedsForGameName = async (game: Game | undefined) => {
    if (!client.isConnected) {
        try {
            await client.connect();
        } catch (err: unknown) {
            console.log("Waiting For OpenRGB...");
        }
    }
    const controllerCount = await client.getControllerCount();
    for (let deviceId = 0; deviceId < controllerCount; deviceId++) {
        const controllerData = await client.getControllerData(deviceId);

        let color = getPrimaryColorForGame(game, controllerData);
        if (game && game.secondaryColor && game.type !== "client") {
            const secondaryColor = utils.hexColor(game.secondaryColor);
            if (controllerData.type === 0) { // Motherboard
                color = secondaryColor;
            }
        }

        if (game && controllerData.type === 0) {
            Object.keys(color).forEach((key) => (color[key] = Math.max(0, color[key] - 20)));
        }

        if (game && controllerData.type === 1) {
            Object.keys(color).forEach((key) => (color[key] = Math.max(0, color[key] - 80)));
        }

        // @ts-ignore
        await client.updateMode(deviceId, "Direct");
        await client.updateLeds(deviceId, Array(controllerData.colors.length).fill(color));
    }
};

const getPrimaryColorForGame = (game: Game | undefined, device: Device) => {
    if (!game || game.type === "client") {
        return utils.color(255, 255, 255);
    }
    return utils.hexColor(game.primaryColor);
};

export async function closeRGBController() {
    await client.disconnect();
}
