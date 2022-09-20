
import { Box, Typography } from "@mui/material";

import { DateTime } from "luxon";

import { SystemInformation } from "../../../electron/api/collectSystemInformation";

const DashBoard = (props: { systemInformation: SystemInformation | undefined }) => {
    return (
        <Box position={"relative"} height={"100%"} p={3}>
            <Box position={"absolute"} top={20} right={20}>
                <Typography variant={"h1"} fontWeight={400}>
                    {DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}
                </Typography>
            </Box>
            <Box display={"flex"} flexDirection={"column"} height={"100%"}>
                
            </Box>
        </Box>
    );
};

export default DashBoard;
