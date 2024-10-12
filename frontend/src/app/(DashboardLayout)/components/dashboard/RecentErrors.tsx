import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Link, Typography } from "@mui/material";
import { errorData } from "../../page";

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  let formattedTime = date
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();

  if (isToday) {
    return `Today at ${formattedTime}`;
  } else if (isYesterday) {
    return `Yesterday at ${formattedTime}`;
  } else {
    return (
      date.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
      ` , ${formattedTime}`
    );
  }
}

const RecentErrors = () => {
  return (
    <DashboardCard title="Recent Error Logs">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: "-40px",
            "& .MuiTimelineConnector-root": {
              width: "1px",
              backgroundColor: "#efefef",
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          {errorData.map((error, index) => {
            return (
              <TimelineItem key={index} style={{ "padding-bottom": "3px" }}>
                <TimelineOppositeContent width={10}>
                  {formatTimestamp(error.timestamp)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="error" variant="outlined" />
                </TimelineSeparator>
                <TimelineContent>{error.errorData.error}</TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentErrors;
