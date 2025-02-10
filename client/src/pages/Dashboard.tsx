import React from 'react'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { cn } from '../utils/talwind'
import { useState } from 'react';
import DatePicker from '../components/Dashboard/date-picker';
import CardsParent from '../components/Dashboard/CardsParent';
import VisitorsChart from '../components/Dashboard/VisitorsChart';
import { useInsightsData } from '../provider/fetchData';
import { getLast24Hour, getToday, getYesterday, getThisWeek, getLastSevenDays, getThisMonth, getLastThirtyDays, getLastNinetyDays  } from '../utils/dateUtils';
import AnalyticsDashboard from '../components/Dashboard/Tabs';


const Dashboard = () => {
    const [dateRange, setDateRange] = useState({
        startDate: getLast24Hour(),
        endDate: new Date(),
    });

    const { data, isLoading, isError } = useInsightsData(dateRange.startDate, dateRange.endDate);
    const handleDateChange = (range) => {
        let startDate, endDate;
        switch (range) {
            case "Last 24 Hours":
                startDate = getLast24Hour();
                endDate = new Date();
                break;
            case "Yesterday":
                startDate = getYesterday();
                endDate = getToday();
                break;
            case "This Week":
                ({ startDate, endDate } = getThisWeek());
                break;
            case "Last 7 Days":
                ({ startDate, endDate } = getLastSevenDays());
                break;
            case "This Month":
                ({ startDate, endDate } = getThisMonth());
                break;
            case "Last 30 Days":
                ({ startDate, endDate } = getLastThirtyDays());
                break;
            case "Last 90 Days":
                ({ startDate, endDate } = getLastNinetyDays());
                break;
            default:
                startDate = getLast24Hour();
                endDate = new Date();
        }
        setDateRange({ startDate, endDate });
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;
    const datad = {
        pages: [
          { page: "/", visits: 192 },
          { page: "/about", visits: 50 },
          { page: "/contact", visits: 30 },
        ],
        devices: [
          { device: "laptop", visits: 32 },
          { device: "mobile", visits: 10 },
          { device: "desktop", visits: 4 },
          { device: "tablet", visits: 1 },
        ],
        locations: {
          city: [
            { location: "Addis Ababa", country: "ET", visits: 17 },
            { location: "Kansas City", country: "US", visits: 9 },
            { location: "Four Oaks", country: "US", visits: 3 },
          ],
          country: [
            { location: "ET", country: "ET", visits: 20 },
            { location: "US", country: "US", visits: 20 },
            { location: "SO", country: "SO", visits: 2 },
          ],
        },
        referrer: [
          { referrer: "direct", referrerDomain: "direct", visits: 31 },
          { referrer: "bing", referrerDomain: "https://www.bing.com/", visits: 10 },
          { referrer: "linkedin", referrerDomain: "https://www.linkedin.com/", visits: 3 },
        ],
        browser: [
          { browser: "chrome", visits: 34 },
          { browser: "firefox", visits: 4 },
          { browser: "edge-chromium", visits: 3 },
        ],
        os: [
          { os: "Windows 10", visits: 29 },
          { os: "Android OS", visits: 6 },
          { os: "iOS", visits: 5 },
        ],
        onlineVisitors: 0,
        utmSources: [],
        utmCampaigns: [],
      };
    
    return (
        <main>
            <LayoutGroup>
                <div
                    className={cn(
                        "w-full space-y-4 transition-all duration-700 dark:text-white/80 scrollbar-hide",
                    )}
                >
                    <div className=" flex flex-col justify-between">
                    <div className="flex gap-2 items-center">
                        <DatePicker onDateChange={handleDateChange} />
                    </div>
                    <CardsParent data={data?.insight} />
                        <div className="p-6">
                        <VisitorsChart data={data?.graph} />
                        </div>

                        <div className="p-6">
                      
      <AnalyticsDashboard data={datad} />
    </div>

                    </div>
                </div>
            </LayoutGroup>
        </main>
    )
}

export default Dashboard
