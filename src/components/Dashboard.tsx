import { Box, Typography } from "@mui/material";
import { Cell, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const DashBoard = (props: { systemInformation: any; }) => {
    const data = [
        {
            value:
                props.systemInformation?.temperature?.filter(
                    (sensor: { Identifier: string; Name: string; }) =>
                        sensor.Identifier === "/amdcpu/0/temperature/0" &&
                        sensor.Name === "CPU Package"
                )[0].Value.toFixed(0) || 0,
            totalPossible: 100
        }
    ];

    console.log(data);
    return (
        <Box height={"100%"} p={3}>
            <Box width={200} height={200} style={{ position: "relative" }}>
                <Box style={{ position: "absolute", top: 0, left: 0 }}>
                    <RadialBarChart
                        width={200}
                        height={200}
                        innerRadius="75%"
                        outerRadius="100%"
                        barSize={25}
                        data={data}
                    >
                        <RadialBar background dataKey="value" />
                        <RadialBar background dataKey="totalPossible">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={"#FFFFFF"} />
                            ))}
                        </RadialBar>
                    </RadialBarChart>
                </Box>
                <Box style={{ position: "absolute", top: "44%", left: "42%" }}>
                    <Typography variant={"h4"}>{data[0].value}°</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default DashBoard;
