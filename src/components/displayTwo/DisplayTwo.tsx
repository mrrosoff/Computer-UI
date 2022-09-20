import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { SystemInformation } from "../../../electron/api/collectSystemInformation";

interface Sensor {
    Identifier: string;
    Name: string;
    Parent: string;
    SensorType: string;
    Value: number;
}

const DisplayTwo = (props: { systemInformation: SystemInformation | undefined }) => {
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

    const cpuPackageTemperature =
        liveSystemData?.temperature
            ?.find((sensor: Sensor) => sensor.Name === "CPU Package")
            .Value.toFixed(0) || "-";

    const cpuLoad =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "CPU Total")
            .Value.toFixed(0) || 0;

    const topCPUCore = liveSystemData?.load
        ?.filter((sensor: Sensor) => sensor.Name.includes("CPU Core"))
        .sort((sensorA: Sensor, sensorB: Sensor) => sensorB.Value - sensorA.Value)[0].Value.toFixed(0) || 0;

    const gpuPackageTemperature =
        liveSystemData?.temperature
            ?.find((sensor: Sensor) => sensor.Name === "GPU Core")
            .Value.toFixed(0) || "-";

    const gpuLoad =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "GPU Core")
            .Value.toFixed(0) || 0;

    const gpuMemoryLoad =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "GPU Memory")
            .Value.toFixed(0) || 0;

    const usedRam =
        liveSystemData?.memory
            ?.find((sensor: Sensor) => sensor.Name === "Used Memory")
            .Value.toFixed(0) || 0;

    const usedDiskSpace = liveSystemData?.load
        ?.filter((sensor: Sensor) => sensor.Name === "Used Space")
        .map((sensor: any, index: number) => ({
            title: `Disk ${index + 1}`,
            value: sensor.Value.toFixed(0),
            unit: "%"
        }));

    return (
        <Box height={"100%"} pl={3} pr={3} pt={3} display={"flex"}>
            <Box width={"60%"} display={"flex"} flexDirection={"column"}>
                <PrimaryCard
                    title={"CPU"}
                    subtitle={props.systemInformation?.cpu.brand}
                    primaryValue={cpuPackageTemperature}
                    secondaryGraphs={[
                        { title: "Load", value: cpuLoad, unit: "%" },
                        { title: "Top Core", value: topCPUCore, unit: "%" }
                    ]}
                />
                <Box mt={3}>
                    <PrimaryCard
                        title={"GPU"}
                        subtitle={props.systemInformation?.graphics.controllers[0].model}
                        primaryValue={gpuPackageTemperature}
                        secondaryGraphs={[
                            { title: "Load", value: gpuLoad, unit: "%" },
                            { title: "Memory", value: gpuMemoryLoad, unit: "%" }
                        ]}
                    />
                </Box>
            </Box>
            <Box ml={3} flexGrow={1} display={"flex"} flexDirection={"column"}>
                <RAMCard
                    title={"RAM"}
                    secondaryGraphs={[{ title: "Used", value: usedRam, unit: " GB" }]}
                />
                <Box mt={2}>
                    <DiskCard title={"Disk"} secondaryGraphs={usedDiskSpace} />
                </Box>
                
            </Box>
        </Box>
    );
};

interface CardProps {
    title: string;
    subtitle?: string;
    primaryValue?: string;
    secondaryGraphs?: {
        title: string;
        value: number | undefined;
        unit?: string;
    }[];
}

const PrimaryCard = (props: CardProps) => {
    return (
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column", border: 1 }}>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={32} fontWeight={400}>
                    {props.title}
                </Typography>
                <Box>
                    <Typography fontSize={20}>{props.subtitle}</Typography>
                </Box>
            </Box>
            <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                <Box mb={1} ml={1}>
                    <Typography fontSize={100} fontWeight={600}>
                        {props.primaryValue}°
                    </Typography>
                </Box>
                <Box ml={6} mt={2} flexGrow={1}>
                    {props.secondaryGraphs?.map((graph, index) => (
                        <Box key={index} width={"100%"} mt={index ? 2 : 0}>
                            <LinearProgress
                                variant="determinate"
                                value={graph.value}
                                sx={{ height: 14, width: "100%" }}
                            />
                            <Box
                                mt={1}
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"space-between"}
                            >
                                <Typography fontSize={20} fontWeight={400}>
                                    {graph.title}
                                </Typography>
                                <Typography fontSize={20} fontWeight={400}>
                                    {graph.value + (graph.unit || "")}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

const RAMCard = (props: CardProps) => {
    const maxRam = 64;
    const normalise = (value: number) => (value / maxRam) * 100;
    return (
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column", border: 1 }}>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={32} fontWeight={400}>
                    {props.title}
                </Typography>
            </Box>
            <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                <Box mt={2} flexGrow={1}>
                    {props.secondaryGraphs?.map((graph, index) => (
                        <Box key={index} width={"100%"} mt={index ? 2 : 0}>
                            <LinearProgress
                                variant="determinate"
                                value={normalise(graph?.value || 0)}
                                sx={{ height: 12, width: "100%" }}
                            />
                            <Box
                                mt={1}
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"space-between"}
                            >
                                <Typography fontSize={20} fontWeight={400}>
                                    {graph.title}
                                </Typography>
                                <Typography fontSize={20} fontWeight={400}>
                                    {graph.value + (graph.unit || "")}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

const DiskCard = (props: CardProps) => {
    return (
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column", border: 1 }}>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={32} fontWeight={400}>
                    {props.title}
                </Typography>
            </Box>
            <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                <Box mt={2} flexGrow={1}>
                    {props.secondaryGraphs?.map((graph, index) => (
                        <Box key={index} width={"100%"} mt={index ? 2 : 0}>
                            <LinearProgress
                                variant="determinate"
                                value={graph.value}
                                sx={{ height: 12, width: "100%" }}
                            />
                            <Box
                                mt={1}
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"space-between"}
                            >
                                <Typography fontSize={20} fontWeight={400}>
                                    {graph.title}
                                </Typography>
                                <Typography fontSize={20} fontWeight={400}>
                                    {graph.value + (graph.unit || "")}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default DisplayTwo;
