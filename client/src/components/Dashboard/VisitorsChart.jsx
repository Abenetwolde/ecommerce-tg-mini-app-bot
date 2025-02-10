import React from "react";
import Chart from "react-apexcharts";

const VisitorsChart = ({ data }) => {
  // Extract unique visitors data
  const uniqueVisitorsData = data?.uniqueVisitorsByDate || [];

  // Prepare chart data
  const chartData = {
    series: [
      {
        name: "Unique Visitors",
        data: uniqueVisitorsData.map(item => item.visits),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      title: {
        text: "Unique Visitors",
        align: "left",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      xaxis: {
        categories: uniqueVisitorsData.map(item => item.date),
        // X-axis labels
        labels: {
          style: {
            colors: "#666",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#666",
            fontSize: "12px",
          },
        },
      },
      colors: ["#3B82F6"], // Bar color
      stroke: {
        width: 2,
        curve: "smooth", // Smooth curve
      },
      markers: {
        size: 5,
        colors: ["#3B82F6"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      grid: {
        borderColor: "#e0e0e0",
        strokeDashArray: 4, // Dotted grid lines
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "12px",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default VisitorsChart;