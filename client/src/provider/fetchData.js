// api/fetchData.js
import { useQuery } from "@tanstack/react-query";

const fetchData = async (startDate, endDate) => {
    const response = await fetch(
        `https://api.loglib.io/v1/insight?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&timeZone=UTC&apiKey=site_s5nv5uifti`
    );
    console.log("response come fom the tanstack",response)
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export const useInsightsData = (startDate, endDate) => {
    return useQuery({
        queryKey: ["insights", startDate.toISOString(), endDate.toISOString()],
        queryFn: () => fetchData(startDate, endDate),
    });
};