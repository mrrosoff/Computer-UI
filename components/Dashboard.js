import React from "react";

import { Box, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    }
}));

const DashBoard = (props) => {
    const classes = useStyles();
    console.log(props.systemInformation);
    return (
        <Box height={"100%"} p={3}>
            {Object.entries(props.systemInformation).map(([key, value]) => {
                return (
                    <Typography key={key}>
                        {key}
                        {Object.entries(value).map(([key, value]) => {
                            return key;
                        })}
                    </Typography>
                );
            })}
        </Box>
    );
};

export default DashBoard;
