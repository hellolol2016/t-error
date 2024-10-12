"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import RecentErrors from "@/app/(DashboardLayout)/components/dashboard/RecentErrors";
import FrequentErrors from "@/app/(DashboardLayout)/components/dashboard/FrequentErrors";
import ErrorOverview from "@/app/(DashboardLayout)/components/dashboard/ErrorOverview";

export const errorData = [
  {
    _id: "6709fb6960c5e6774c0a1b54",
    uniqueId: "1",
    errorData: {
      command: "git pull",
      error: "error message",
    },
    timestamp: "2024-10-12T00:30:33.346Z",
    v: 0,
  },
  {
    _id: "670a00a0fa6909f5fb394bcd",
    uniqueId: "2",
    errorData: {
      command: "git pull",
      error: "error message",
    },
    timestamp: "2024-10-12T04:52:48.089Z",
    v: 0,
  },
  {
    _id: "670a00b8f1b248135350a03c",
    uniqueId: "3",
    errorData: {
      command: "git pull",
      error: "error message",
    },
    timestamp: "2024-10-12T04:53:12.628Z",
    v: 0,
  },
  {
    _id: "670a00ecdee1b638e6b2fd1c",
    uniqueId: "4",
    errorData: {
      command: "git pull",
      error: "error message",
    },
    timestamp: "2024-10-12T04:54:04.728Z",
    v: 0,
  },
  {
    _id: "670a03bf1e73b32a54ec70e0",
    uniqueId: "5",
    errorData: {
      command: "poop",
      error: "/bin/sh: poop: command not found\n",
    },
    timestamp: "2024-10-12T05:06:07.008Z",
    __v: 0,
  },
  {
    _id: "677a00b8f1b248135350a03c",
    uniqueId: "6",
    errorData: {
      command: "git jull",
      error: "test other message",
    },
    timestamp: "2024-10-12T04:53:12.628Z",
    v: 0,
  },
];

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={11}>
            <RecentErrors />
          </Grid>
          <Grid item xs={12} lg={5}>
            <ErrorOverview />
          </Grid>
          <Grid item xs={12} lg={6}>
            <FrequentErrors />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
