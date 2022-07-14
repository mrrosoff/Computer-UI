import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

import { CssBaseline } from "@mui/material";
import { blue, green } from "@mui/material/colors";

import {
	createTheme,
	responsiveFontSizes,
	ThemeProvider,
	StyledEngineProvider
} from "@mui/material/styles";

import axios from "axios";
import { DateTime } from "luxon";

import DashBoard from "./Dashboard";

const App = () => {
	const [systemInformation, setSystemInformation] = useState({});
	const [sunData, setSunData] = useState();

	useEffect(() => {
		const getSunDataFromAPI = async () => {
			const coords = { lat: 32.95325541910332, lng: -117.24177865770446 };
			const { data } = await axios.get(
				`https://api.sunrise-sunset.org/json?lat=${coords.lat}&lng=${coords.lng}&formatted=0`
			);
			setSunData(data.results);
		};

		getSunDataFromAPI();
		const interval = setInterval(getSunDataFromAPI, 60000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		ipcRenderer.on("send-system-info", (_, value) => {
            setSystemInformation(value);
        });
	}, [])

	let mode = "light";
	if (sunData) {
		const nowHour = DateTime.now().hour;
		const sunsetHour = DateTime.fromISO(sunData.sunset).hour;
		const sunriseHour = DateTime.fromISO(sunData.sunrise).hour;

		if (nowHour < sunriseHour + 1 || nowHour > sunsetHour + 1) {
			mode = "dark";
		}
	}

	const theme = responsiveFontSizes(
		createTheme({
			palette: { mode, primary: { main: blue[500] }, secondary: { main: green[500] } }
		})
	);

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<DashBoard systemInformation={systemInformation} />
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

export default App;
