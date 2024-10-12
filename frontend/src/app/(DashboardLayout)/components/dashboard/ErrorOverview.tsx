import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { errorData } from "@/app/(DashboardLayout)/page";
import { BarChart } from "@mui/x-charts";
import { Box, Grid } from "@mui/material";

function groupErrorByHour(errorData: any) {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return errorData.reduce((acc: Record<string, number>, error: any) => {
    const errorDate = new Date(error.timestamp);
    if (errorDate >= last24Hours) {
      const date = errorDate.toISOString().split("T")[0];
      const hour = errorDate.getHours(); // Get the hour part
      const formattedHour = `${formatDate(date)} ${hour
        .toString()
        .padStart(2, "0")}:00`; // Format as "HH:00"
      acc[formattedHour] = (acc[formattedHour] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
}
function formatDate(date: string) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(now.setDate(now.getDate() - 1))
    .toISOString()
    .split("T")[0];

  if (date === today) {
    return "Today";
  } else if (date === yesterday) {
    return "Yesterday";
  } else {
    return date;
  }
}

const ErrorOverview = () => {
  const [groupedData, setGroupedData] = useState<Record<string, number>>({});

  useEffect(() => {
    const grouped = groupErrorByHour(errorData);
    setGroupedData(grouped);
  }, []);

  const xAxisData = Object.keys(groupedData);
  const seriesData = Object.values(groupedData);

  return (
    <DashboardCard title="Error Frequency History">
      <Box
        sx={{
          width: "100%",
          margin: "0 auto", // Center the box horizontally
          height: "24vh",
        }}
      >
        <BarChart
          xAxis={[{ scaleType: "band", data: xAxisData }]}
          series={[{ data: seriesData }]}
        />
      </Box>
    </DashboardCard>
  );
};

export default ErrorOverview;
