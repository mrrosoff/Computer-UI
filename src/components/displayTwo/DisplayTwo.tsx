import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import CPUGraph from "../graphs/CPUGraph";

const DisplayTwo = () => {
    const { VITE_SYSTEM_SYNC_TIME_INTERVAL } = import.meta.env;

    const [liveSystemData, setLiveSystemData] = useState<any>();

    useEffect(() => {
        const collectLiveSystemData = async () => {
            const data = await window.ipcAPI.collectLiveSystemData();
            setLiveSystemData(data);
        };

        collectLiveSystemData();
        const interval = setInterval(collectLiveSystemData, VITE_SYSTEM_SYNC_TIME_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box height={"100%"} p={3}>
            <CPUGraph liveSystemData={liveSystemData} />
        </Box>
    );
};

export default DisplayTwo;
