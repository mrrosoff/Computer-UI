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
            ?.Value.toFixed(0) || "-";

    const cpuLoad =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "CPU Total")
            ?.Value.toFixed(0) || 0;

    const cpuClockValues = liveSystemData?.clock
        ?.filter((sensor: Sensor) => sensor.Name.includes("CPU Core"))
        .map((sensor: Sensor) => sensor.Value);

    const averageCPUClock =
        (
            cpuClockValues?.reduce((a: number, b: number) => a + b) /
            cpuClockValues?.length /
            1000
        )?.toFixed(2) || 0;

    const gpuPackageTemperature =
        liveSystemData?.temperature
            ?.find((sensor: Sensor) => sensor.Name === "GPU Core")
            ?.Value.toFixed(0) || 0;

    const gpuLoad =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "GPU Cq  ore")
            ?.Value.toFixed(0) || 0;

    const gpuMemoryLoad =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "GPU Memory")
            ?.Value.toFixed(0) || 0;

    const usedRam =
        liveSystemData?.load
            ?.find((sensor: Sensor) => sensor.Name === "Memory")
            ?.Value.toFixed(0) || 0;

    const usedDiskSpace = liveSystemData?.load
        ?.filter((sensor: Sensor) => sensor.Name === "Used Space")
        .sort((a: { Value: number }, b: { Value: number }) => b.Value - a.Value)
        .map((sensor: any, index: number) => ({
            title: `Disk ${index + 1}`,
            value: sensor.Value.toFixed(0),
            unit: "%"
        }))
        .slice(0, 2);   

    return (
        <Box height={"100%"} p={3} display={"flex"}>
            <Box width={"60%"} display={"flex"} flexDirection={"column"}>
                <PrimaryCard
                    title={"CPU"}
                    subtitle={props.systemInformation?.cpu.brand}
                    primaryValue={cpuPackageTemperature}
                    secondaryGraphs={[
                        { title: "Load", value: cpuLoad, unit: "%" },
                        {
                            title: "Average Clock",
                            value: averageCPUClock,
                            unit: " GHz",
                            maxValue: 5
                        }
                    ]}
                />
                <Box mt={3} flexGrow={1}>
                    <PrimaryCard
                        title={"GPU"}
                        subtitle={props.systemInformation?.graphics.controllers[0].model}
                        primaryValue={gpuPackageTemperature}
                        secondaryGraphs={[
                            { title: "Load", value: gpuLoad, unit: "%" },
                            { title: "Memory", value: gpuMemoryLoad, unit: "%" }
                        ]}
                        isBottom
                    />
                </Box>
            </Box>
            <Box ml={3} flexGrow={1} display={"flex"} flexDirection={"column"}>
                <SecondaryCard
                    title={"RAM"}
                    secondaryGraphs={[
                        {
                            title: "Used",
                            value: usedRam,
                            unit: `% (${((usedRam / 100) * 64).toFixed(0)} GB)`
                        }
                    ]}
                />
                <Box mt={2}>
                    <SecondaryCard title={"Disk"} secondaryGraphs={usedDiskSpace} />
                </Box>
                <Box mt={2} flexGrow={1}>
                    <OperatingSystemCard text={props.systemInformation?.osInfo.distro} />
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
        value: number | string | undefined;
        maxValue?: number;
        unit?: string;
    }[];
    isBottom?: boolean;
}

const PrimaryCard = (props: CardProps) => {
    const normalize = (value: number, maxValue: number) => (value / maxValue) * 100;
    return (
        <Paper
            sx={{
                p: 3,
                pb: 0,
                display: "flex",
                flexDirection: "column",
                border: 1,
                height: props.isBottom ? "100%" : undefined
            }}
        >
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={32} fontWeight={400}>
                    {props.title}
                </Typography>
                <Box>
                    <Typography fontSize={22}>{props.subtitle}</Typography>
                </Box>
            </Box>
            <Box mt={1} display={"flex"} justifyContent={"space-between"}>
                <Box mb={1} ml={1}>
                    <Typography fontSize={115} fontWeight={600}>
                        {props.primaryValue}°
                    </Typography>
                </Box>
                <Box ml={6} mt={2} flexGrow={1}>
                    {props.secondaryGraphs?.map((graph, index) => (
                        <Box key={index} width={"100%"} mt={index ? 2 : 0}>
                            <LinearProgress
                                variant="determinate"
                                value={normalize(
                                    (graph.value as number) || 0,
                                    graph.maxValue || 100
                                )}
                                sx={{ height: 15, width: "100%" }}
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

const SecondaryCard = (props: CardProps) => {
    return (
        <Paper
            sx={{
                p: 3,
                pl: 4,
                pr: 4,
                display: "flex",
                flexDirection: "column",
                border: 1,
                height: props.isBottom ? "100%" : undefined
            }}
        >
            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={32} fontWeight={400}>
                    {props.title}
                </Typography>
                <Box>
                    <Typography fontSize={18}>{props.subtitle}</Typography>
                </Box>
            </Box>
            {props.secondaryGraphs && (
                <Box mt={1} display={"flex"} justifyContent={"space-between"}>
                    <Box mt={2} flexGrow={1}>
                        {props.secondaryGraphs.map((graph, index) => (
                            <Box key={index} width={"100%"} mt={index ? 2 : 0}>
                                <LinearProgress
                                    variant="determinate"
                                    value={graph.value as number}
                                    sx={{ height: 10, width: "100%" }}
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
            )}
        </Paper>
    );
};

const OperatingSystemCard = (props: { text: string | undefined }) => {
    return (
        <Paper
            sx={{
                p: 3,
                display: "flex",
                border: 1,
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Typography fontSize={22} fontWeight={400}>
                {props.text}
            </Typography>
        </Paper>
    );
};

export default DisplayTwo;
