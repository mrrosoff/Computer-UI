import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { DateTime } from "luxon";

import { SystemInformation } from "../../../electron/api/collectSystemInformation";

import ValorantLogo from "../../assets/images/valorant-logo-icon.png";
import LeagueLogo from "../../assets/images/LoL_icon.png";
import Overwatch2Logo from "../../assets/images/Overwatch_2_logo.png";

const DashBoard = (props: { systemInformation: SystemInformation | undefined }) => {
    const { VITE_GAME_SYNC_TIME_INTERVAL } = import.meta.env;

    const [currentlyPlayingGame, setCurrentlyPlayingGame] = useState<any>();

    useEffect(() => {
        const collectCurrentlyPlayingGame = async () => {
            const data = await window.ipcAPI.getCurrentlyPlayingGame();
            setCurrentlyPlayingGame(data);
        };

        collectCurrentlyPlayingGame();
        const interval = setInterval(collectCurrentlyPlayingGame, VITE_GAME_SYNC_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    if (!currentlyPlayingGame) {
        return (
            <Box
                p={3}
                display={"flex"}
                height={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Typography fontSize={150} fontWeight={400}>
                    {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={3} display={"flex"} flexDirection={"column"} height={"100%"}>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={45} fontWeight={500}>
                    {currentlyPlayingGame.includes("Client")
                        ? "Getting Ready For"
                        : "Currently Playing"}
                </Typography>
                <Box pl={3} pr={3}>
                    <Typography fontSize={55} fontWeight={500}>
                        {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
                    </Typography>
                </Box>
            </Box>
            <Box
                p={5}
                flexGrow={1}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <GameStatus
                    gameImage={gameImageFromGameName(currentlyPlayingGame)}
                    gameName={currentlyPlayingGame}
                />
            </Box>
        </Box>
    );
};

const GameStatus = (props: { gameImage?: any; gameName: string }) => {
    return (
        <Box display={"flex"} alignItems={"center"}>
            {props.gameImage && (
                <img
                    src={props.gameImage}
                    alt="Game Logo"
                    style={{ width: 180, height: 180, objectFit: "cover", border: "none" }}
                />
            )}
            <Typography fontSize={85} fontWeight={500} sx={{ ml: 10 }}>
                {props.gameName.includes("Client") ? props.gameName.substring(props.gameName.indexOf(")") + 1).trim() : props.gameName}
            </Typography>
        </Box>
    );
};

const gameImageFromGameName = (gameName: string) => {
    if (gameName === "Valorant") {
        return ValorantLogo;
    } else if (gameName.includes("League of Legends")) {
        return LeagueLogo;
    } else if (gameName === "Overwatch2") {
        return Overwatch2Logo;
    }
};

export default DashBoard;
