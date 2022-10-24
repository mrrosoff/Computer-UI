import { useEffect, useState } from "react";

import { CssBaseline } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
    StyledEngineProvider
} from "@mui/material/styles";

import { SystemInformation } from "../../electron/api/collectSystemInformation";
import DisplayOne from "./displayOne/DisplayOne";
import DisplayTwo from "./displayTwo/DisplayTwo";

const App = () => {
    const theme = responsiveFontSizes(
        createTheme({
            palette: { mode: "dark", primary: { main: blue[500] }, secondary: { main: green[500] } }
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
