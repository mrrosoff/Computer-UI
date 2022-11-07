import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { DateTime } from "luxon";

import { SystemInformation } from "../../../electron/api/collectSystemInformation";

import ValorantLogo from "../../assets/images/valorant-logo-icon.png";
import LeagueLogo from "../../assets/images/LoL_icon.png";
import Overwatch2Logo from "../../assets/images/Overwatch_2_logo.png";

const DashBoard = (props: { systemInformation: SystemInformation | undefined, currentlyPlayingGame: string | undefined }) => {
    const [time, setTime] = useState<string>(DateTime.now().toLocaleString(DateTime.TIME_SIMPLE));

    useEffect(() => {
        const oneMinute = 60 * 1000;
        const timer = setInterval(
            () => setTime(DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)),
            oneMinute
        );
        return () => clearInterval(timer);
    }, []);

    if (!props.currentlyPlayingGame) {
        return (
            <Box p={3} display={"flex"} flexDirection={"column"} height={"100%"}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={45} fontWeight={500}>
                        {"Current Mood"}
                    </Typography>
                    <Box pl={3} pr={3}>
                        <Typography fontSize={60} fontWeight={500}>
                            {time}
                        </Typography>
                    </Box>
                </Box>
                <Box pt={2}>
                    <Typography fontSize={80} fontWeight={400}>
                        {"Hello Sir, how are you today?"}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box p={3} display={"flex"} flexDirection={"column"} height={"100%"}>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={45} fontWeight={500}>
                    {props.currentlyPlayingGame.includes("Client")
                        ? "Getting Ready For"
                        : "Currently Playing"}
                </Typography>
                <Box pl={3} pr={3}>
                    <Typography fontSize={60} fontWeight={500}>
                        {time}
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
                    gameImage={gameImageFromGameName(props.currentlyPlayingGame)}
                    gameName={props.currentlyPlayingGame}
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
                {props.gameName.includes("Client")
                    ? props.gameName.substring(props.gameName.indexOf(")") + 1).trim()
                    : props.gameName}
            </Typography>
        </Box>
    );
};

const gameImageFromGameName = (gameName: string) => {
    if (gameName === "Valorant") {
        return ValorantLogo;
    } else if (gameName.includes("League of Legends")) {
        return LeagueLogo;
    } else if (gameName === "Overwatch 2") {
        return Overwatch2Logo;
    }
};

export default DashBoard;
