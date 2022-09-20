import { useEffect, useState } from "react";

import { CssBaseline, PaletteMode } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import { DateTime } from "luxon";

import { SystemInformation } from "../../electron/api/collectSystemInformation";
import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import DisplayOne from "./displayOne/DisplayOne";
import DisplayTwo from "./displayTwo/DisplayTwo";

const App = () => {
    const { VITE_API_SYNC_TIME_INTERVAL, VITE_LATITUDE, VITE_LONGITUDE } = import.meta.env;
    const sunData = callExternalAPIOnInterval(
        VITE_API_SYNC_TIME_INTERVAL,
        `https://api.sunrise-sunset.org/json?lat=${VITE_LATITUDE}&lng=${VITE_LONGITUDE}&formatted=0`
    );

    let mode: PaletteMode = "light";

    if (sunData?.results) {
        const nowHour = DateTime.now().hour;
        const sunsetHour = DateTime.fromISO(sunData.results.sunset).hour;
        const sunriseHour = DateTime.fromISO(sunData.results.sunrise).hour;

        if (nowHour < sunriseHour + 1 || nowHour > sunsetHour + 1) {
            mode = "dark";
        }
    }

    const theme = responsiveFontSizes(
        createTheme({
            palette: { mode, primary: { main: blue[500] }, secondary: { main: green[500] } }
        })
    );

    const [displayNumber, setDisplayNumber] = useState<number>();
    const [systemInformation, setSystemInformation] = useState<SystemInformation>();

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

    return (
        <StyledEngineProvider injectFirst={true}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {displayNumber === 1 && <DisplayOne systemInformation={systemInformation} />}
                {displayNumber === 2 && <DisplayTwo systemInformation={systemInformation} />}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
