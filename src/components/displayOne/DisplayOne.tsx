
import { Box, Typography } from "@mui/material";

import { DateTime } from "luxon";

import { SystemInformation } from "../../../electron/api/collectSystemInformation";

const DashBoard = (props: { systemInformation: SystemInformation | undefined }) => {
    return (
        <Box height={"100%"} p={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Typography fontSize={100} fontWeight={500}>{DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}</Typography>
        </Box>
    );
};

export default DashBoard;
