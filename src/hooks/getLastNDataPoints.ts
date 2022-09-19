import { useEffect, useState } from "react";

const getLastNDataPoints = (numberOfDataPoints: number, variable: any): any[] => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (variable) {
            if (data.length >= numberOfDataPoints) {
                data.shift();
            }
            setData([...data, variable]);
        }
    }, [variable]);

    return data;
};

export default getLastNDataPoints;
