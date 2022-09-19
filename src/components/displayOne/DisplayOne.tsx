import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import LandscapeIcon from "@mui/icons-material/Landscape";
import AndroidIcon from "@mui/icons-material/Android";
import DnsIcon from "@mui/icons-material/Dns";

const DashBoard = () => {
    const [systemInformation, setSystemInformation] = useState<any>();

    useEffect(() => {
        const collectSystemInformation = async () => {
            const data = await window.ipcAPI.collectSystemInformation();
            setSystemInformation(data);
        };

        collectSystemInformation();
    }, []);

    console.log(systemInformation);

    return (
        <Box height={"100%"} p={3}>
            <Box display={"flex"} flexDirection={"column"} height={"100%"}>
                <Box display={"flex"} alignItems={"center"}>
                    <AccessTimeIcon />
                    Current Time: {systemInformation?.time.current}
                    Uptime: {systemInformation?.time.uptime}
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <DeveloperBoardIcon />
                    {systemInformation?.cpu.manufacturer}
                    {systemInformation?.cpu.brand}
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <LandscapeIcon />
                    {systemInformation?.graphics.controllers[0].model}
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <AndroidIcon />
                    {systemInformation?.osInfo.distro}
                    {systemInformation?.uptime}
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <DnsIcon />
                    {systemInformation?.diskLayout.map((disk: any) => disk.name)}
                </Box>
            </Box>
        </Box>
    );
};

export default DashBoard;
