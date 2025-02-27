// api/fetchData.js
import { useQuery } from "@tanstack/react-query";
import Axios from "../utils/Axios";

const fetchData = async (startDate, endDate) => {
    const response = await fetch(
        `https://api.loglib.io/v1/insight?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&timeZone=UTC&apiKey=site_8turrs2h9k`
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
export const  fetchUser = async () => {
    const response = await Axios.get('/api/user/user-details');
    console.log("azuios use response..........", response.data)
    if (!response.data.success) {
      throw new Error('Failed to fetch user data');
    }
    return response.data.data;
  };
  
