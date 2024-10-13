"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import RecentErrors from "@/app/(DashboardLayout)/components/dashboard/RecentErrors";
import FrequentErrors from "@/app/(DashboardLayout)/components/dashboard/FrequentErrors";
import ErrorHistory from "@/app/(DashboardLayout)/components/dashboard/ErrorHistory";
import { useEffect, useState } from "react";
import { ErrorProvider } from "./context/ErrorContext";

const Dashboard = () => {
  return (
    <ErrorProvider>
      <PageContainer
        title="t-Error"
        description="this is t-error's streamlined dashboard for quantifying terminal errors"
      >
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={11}>
              <RecentErrors />
            </Grid>
            <Grid item xs={12} lg={5}>
              <ErrorHistory />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FrequentErrors />
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    </ErrorProvider>
  );
};

export default Dashboard;
