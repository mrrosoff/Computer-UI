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

import callExternalAPIOnInterval from "../hooks/callExternalAPIOnInterval";
import DashBoard from "./Dashboard";

const App = () => {
    const { VITE_TIME_INTERVAL, VITE_LATITUDE, VITE_LONGITUDE } = import.meta.env;
    const sunData = callExternalAPIOnInterval(
        VITE_TIME_INTERVAL,
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
    const [systemInformation, setSystemInformation] = useState<any>();

    useEffect(() => {
        const getDisplayNumber = async () => {
            const data = await window.ipcAPI.getWindowNumber();
            setDisplayNumber(data);
        };
        getDisplayNumber();
    }, []);

    useEffect(() => {
        const getSystemInformation = async () => {
            const data = await window.ipcAPI.getSystemData(displayNumber);
            setSystemInformation(data);
        };

        getSystemInformation();
        const interval = setInterval(getSystemInformation, VITE_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, [displayNumber]);

    return (
        <StyledEngineProvider injectFirst={true}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <DashBoard systemInformation={systemInformation} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
