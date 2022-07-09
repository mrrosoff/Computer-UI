import React, { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    }
}));

const DashBoard = (props) => {
    const classes = useStyles();

	// window.electronAPI.sendSystemInfo((event, value) => {
    //     console.log(value);
    // });

    return <Box height={"100%"} p={3}></Box>;
};

export default DashBoard;
