import { useEffect, useMemo, useState } from "react";

import { CssBaseline } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import { Game } from "../../games";
import { SystemInformation } from "../../electron/api/collectSystemInformation";
import DisplayOne from "./displayOne/DisplayOne";
import DisplayTwo from "./displayTwo/DisplayTwo";

const App = () => {
    const { VITE_GAME_SYNC_TIME_INTERVAL } = import.meta.env;

    const [displayNumber, setDisplayNumber] = useState<number>();
    const [systemInformation, setSystemInformation] = useState<SystemInformation>();
    const [currentlyPlayingGame, setCurrentlyPlayingGame] = useState<Game>();

    useEffect(() => {
        const getDisplayNumber = async () => {
            const data = await window.ipcAPI.getWindowNumber();
            setDisplayNumber(data);
        };

        getDisplayNumber();
    }, []);

    useEffect(() => {
        const collectSystemInformation = async () => {
            const data = await window.ipcAPI.collectSystemInformation();
            setSystemInformation(data);
        };

        collectSystemInformation();
    }, []);

    useEffect(() => {
        const collectCurrentlyPlayingGame = async () => {
            const data = await window.ipcAPI.getCurrentlyPlayingGame();
            setCurrentlyPlayingGame(data);
        };

        collectCurrentlyPlayingGame();
        const interval = setInterval(collectCurrentlyPlayingGame, VITE_GAME_SYNC_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const theme = useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    palette: {
                        mode: "dark",
                        primary: { main: currentlyPlayingGame?.color || blue[500] },
                        secondary: { main: green[500] }
                    }
                })
            ),
        [currentlyPlayingGame]
    );

    return (
        <StyledEngineProvider injectFirst={true}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {displayNumber === 1 && (
                    <DisplayOne
                        systemInformation={systemInformation}
                        currentlyPlayingGame={currentlyPlayingGame}
                    />
                )}
                {displayNumber === 2 && <DisplayTwo systemInformation={systemInformation} />}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
