import React from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";

import {
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
	BarChart,
	Bar,
	LabelList
} from "recharts";
import makeStyles from "@mui/styles/makeStyles";
import { grey } from "@mui/material/colors";

const useStyles = makeStyles((theme) => ({
	cardBox: {
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: grey[300],
		borderRadius: 5,
		height: 200
	}
}));

const SurfCard = (props) => {
	const classes = useStyles();
	return (
		<Box
			pt={2}
			pl={2}
			pr={2}
			className={classes.cardBox}
			display={"flex"}
			flexDirection={"column"}
		>
			<Grid item container justifyContent={"space-between"}>
				<Grid item>
					<Typography style={{ fontSize: 32, fontWeight: 500 }}>Surf</Typography>
				</Grid>
			</Grid>
			<Box pt={1} flexGrow={1}>
				<SurfGraph {...props} />
			</Box>
		</Box>
	);
};

const SurfGraph = (props) => {
	const theme = useTheme();
	return (
		<ResponsiveContainer width={"99%"} height={"100%"}>
			<BarChart
				data={props.surfData.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<YAxis
					dataKey="waveHeight"
					domain={[
						0,
						Math.floor(Math.max(...props.surfData.map((item) => item.waveHeight))) + 3
					]}
					hide
				/>
				<XAxis dataKey="name" />
				<Bar dataKey="waveHeight" fill={theme.palette.primary.main} minPointSize={5}>
					<LabelList dataKey="waveHeight" content={renderCustomizedLabel} />
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

const renderCustomizedLabel = (props) => {
	const theme = useTheme();
	const { x, y, width, value } = props;
	const radius = 10;
	const waveHeight = Math.round(value * 2) / 2;
	const isDecimal = waveHeight % 1 !== 0;
	return (
		<text
			style={{ fontWeight: 600 }}
			x={x + width / 2}
			y={y - radius}
			fill={theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"}
			textAnchor="middle"
			dominantBaseline="middle"
		>
			{isDecimal ? waveHeight.toFixed(1) : waveHeight.toFixed(0) + " ft"}
		</text>
	);
};

export default SurfCard;
