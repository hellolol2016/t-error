import dynamic from "next/dynamic";
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpRight, IconAlertTriangle } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { errorData } from '@/app/(DashboardLayout)/page';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ErrorDataType {
  _id: string;
  uniqueId: string;
  errorData: {
    command: string;
    error: string;
  };
  timestamp: string;
  v: number;
}

const MonthlyEarnings = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';

  // Process error data
  const errorsByDate = errorData.reduce((acc: Record<string, number>, error: ErrorDataType) => {
    const date = new Date(error.timestamp).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalErrors = Object.values(errorsByDate).reduce((sum: number, count: number) => sum + count, 0);
  const uniqueDays = Object.keys(errorsByDate).length;
  const dailyAverage = totalErrors / uniqueDays;

  // chart
  const optionscolumnchart: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
      },
    },
    colors: [secondary],
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [
    {
      name: 'Daily Errors',
      data: Object.values(errorsByDate),
    },
  ];

  return (
      <DashboardCard
          title="Error Overview"
          action={
            <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
              <IconAlertTriangle width={24} />
            </Fab>
          }
          footer={
            <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height={60} width={"100%"} />
          }
      >
        <>
          <Typography variant="h3" fontWeight="700" mt="-20px">
            {dailyAverage.toFixed(2)}
          </Typography>
          <Stack direction="row" spacing={1} my={1} alignItems="center">
            <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
              <IconArrowUpRight width={20} color="#FA896B" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {totalErrors}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              total errors
            </Typography>
          </Stack>
        </>
      </DashboardCard>
  );
};

export default MonthlyEarnings;