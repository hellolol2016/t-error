"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import RecentErrors from "@/app/(DashboardLayout)/components/dashboard/RecentErrors";
import FrequentErrors from "@/app/(DashboardLayout)/components/dashboard/FrequentErrors";
import ErrorOverview from "@/app/(DashboardLayout)/components/dashboard/ErrorOverview";
import { useEffect, useState } from "react";
import { ErrorProvider } from "./context/ErrorContext";

const fetchErrorData = async () => {
  const res = await fetch("http://localhost:3001/errors")
  if(!res.ok) {
    throw new Error("Failed to fetch error data")
  }
  const data = await res.json();
  return data;
}
export const errorData = fetchErrorData();

const Dashboard = () => {
  useEffect(() => {
    const getData = async() =>{
      try{
        const data = await fetchErrorData();
        setErrors(data);
      }catch (e){
        console.error(e);
      }
    }
    getData();
  },[]);
  const [errors, setErrors] = useState([]);

  return (
    <ErrorProvider>
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
</ErrorProvider>
  );
};

export default Dashboard;
