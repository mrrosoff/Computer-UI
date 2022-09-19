import { Box, Typography } from "@mui/material";
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    RadialBar,
    RadialBarChart,
    XAxis,
    YAxis
} from "recharts";
import getLastNDataPoints from "../../hooks/getLastNDataPoints";

const CPUGraph = (props: any) => {
    const cpuPackageTemperature =
        props.liveSystemInformation?.temperature
            ?.filter(
                (sensor: { Identifier: string; Name: string }) =>
                    sensor.Identifier === "/amdcpu/0/temperature/0" && sensor.Name === "CPU Package"
            )[0]
            .Value.toFixed(0) || 0;

    const time = new Date().toISOString();
    const cpuGraphData = getLastNDataPoints(20, {
        timestamp: time,
        value: cpuPackageTemperature
    });

    const radialGraphData = [{ value: cpuPackageTemperature, totalPossible: 100 }];

    return (
        <Box width={200} height={200} style={{ position: "relative" }}>
            <Box style={{ position: "absolute", top: 0, left: 0 }}>
                <RadialBarChart
                    width={200}
                    height={200}
                    startAngle={180}
                    endAngle={-180}
                    innerRadius="75%"
                    outerRadius="100%"
                    barSize={25}
                    data={radialGraphData}
                >
                    <RadialBar background dataKey="value" />
                    <RadialBar background dataKey="totalPossible">
                        {radialGraphData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={"#FFFFFF"} />
                        ))}
                    </RadialBar>
                </RadialBarChart>
            </Box>
            <Box style={{ position: "absolute", top: "40%", left: "42%" }}>
                <Typography variant={"h4"}>CPU</Typography>
                <Typography variant={"h4"}>{radialGraphData[0].value}°</Typography>
            </Box>
            <LineChart
                width={500}
                height={300}
                data={cpuGraphData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
        </Box>
    );
};

export default CPUGraph;
