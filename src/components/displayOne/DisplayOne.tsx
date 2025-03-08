import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { DateTime } from "luxon";

import { SystemInformation } from "../../../electron/api/collectSystemInformation";
import { Game } from "../../../games";

const DisplayOne = (props: {
    systemInformation: SystemInformation | undefined;
    currentlyPlayingGame: Game | undefined;
}) => {
    const [time, setTime] = useState<DateTime>(DateTime.now());

    useEffect(() => {
        const oneMinute = 60 * 1000;
        const timer = setInterval(() => setTime(DateTime.now()), oneMinute);
        return () => clearInterval(timer);
    }, []);

    const getTimeOfDayString = () => {
        if (time.hour > 5 && time.hour < 12) {
            return "Morning";
        } else if (time.hour >= 12 && time.hour < 17) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    };

    if (!props.currentlyPlayingGame) {
        return (
            <Box p={3} display={"flex"} flexDirection={"column"} height={"100%"}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography fontSize={45} fontWeight={500}>
                        {props.systemInformation?.osInfo.hostName}
                    </Typography>
                    <Box pl={3} pr={3}>
                        <Typography fontSize={60} fontWeight={500}>
                            {time.toLocaleString(DateTime.TIME_SIMPLE)}
                        </Typography>
                    </Box>
                </Box>
                <Box flexGrow={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Typography align={"center"} fontSize={80} fontWeight={400}>
                        {`Good ${getTimeOfDayString()} Max`}
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box p={3} display={"flex"} flexDirection={"column"} height={"100%"}>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={45} fontWeight={500}>
                    {props.currentlyPlayingGame.type === "client"
                        ? "Getting Ready For"
                        : "Currently Playing"}
                </Typography>
                <Box pl={3} pr={3}>
                    <Typography fontSize={60} fontWeight={500}>
                        {time.toLocaleString(DateTime.TIME_SIMPLE)}
                    </Typography>
                </Box>
            </Box>
            <Box
                p={props.currentlyPlayingGame.name ? 5 : 0}
                flexGrow={1}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <GameStatus
                    gameImage={props.currentlyPlayingGame.icon}
                    gameName={props.currentlyPlayingGame.name}
                />
            </Box>
        </Box>
    );
};

const GameStatus = (props: { gameImage?: any; gameName: string | undefined }) => {
    const image = new Image();
    image.src = props.gameImage;
    return (
        <Box display={"flex"} alignItems={"center"}>
            {props.gameImage && (
                <img
                    src={props.gameImage}
                    alt="Game Logo"
                    style={{
                        height: props.gameName ? Math.min(image.width / 8, 140) : 200,
                        objectFit: "cover",
                        border: "none"
                    }}
                />
            )}
            {props.gameName && (
                <Typography fontSize={85} fontWeight={500} sx={{ ml: 8 }}>
                    {props.gameName.includes("Client")
                        ? props.gameName.substring(props.gameName.indexOf(")") + 1).trim()
                        : props.gameName}
                </Typography>
            )}
        </Box>
    );
};

export default DisplayOne;
