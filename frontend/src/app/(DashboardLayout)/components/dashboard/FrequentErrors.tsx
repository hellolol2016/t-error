import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import { useContext } from "react";
import { ErrorContext } from "../../context/ErrorContext";

interface ErrorItem {
  errorData: { command: any; error: any };
}

export function compileData(errorData: ErrorItem[]) {
  // Define priority mapping
  const priorityMapping: { [key: string]: string } = {
    "git pull": "Low",
    poop: "High",
  };
  // Use a Map to group and count errors by command
  const errorMap = new Map();

  errorData.forEach((item) => {
    const { command, error } = item.errorData;
    const priority = priorityMapping[command] || "Medium"; // Default to 'medium' if not specified

    if (errorMap.has(command)) {
      errorMap.get(command).count++;
    } else {
      errorMap.set(command, { error, priority, count: 1 });
    }
  });

  // Convert Map to array of objects
  const compiledData = Array.from(errorMap, ([command, data]) => ({
    command,
    error: data.error,
    priority: data.priority,
    pbg:
      data.priority === "Low"
        ? "primary.main"
        : data.priority === "Mediumm"
        ? "secondary.main"
        : "error.main",
    count: data.count,
  }));

  return compiledData;
}
const FrequentErrors = () => {
  const errorData = useContext(ErrorContext) ?? [];
  return (
      <DashboardCard title="Frequent Errors">
        <Box
            sx={{
              overflow: "auto",
              height: "24vh",
              width: { xs: "280px", sm: "auto" },
            }}
        >
          <Table
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
                mt: 2,
                '& tbody tr': {
                  transition: 'background-color 0.3s',
                },
                '& tbody tr:hover': {
                  backgroundColor: 'rgba(50, 50, 50, 0.1)',
                },
              }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Command
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Error
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Priority
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Count
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compileData(errorData).map((error, index) => (
                  <TableRow
                      key={index}
                  >
                    <TableCell>
                      <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {error.command}
                          </Typography>
                          <Typography
                              color="textSecondary"
                              sx={{
                                fontSize: "12px",
                              }}
                          >
                            {error.error}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                          color="textSecondary"
                          variant="subtitle1"
                          fontWeight={399}
                      >
                        {error.command}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                          sx={{
                            px: "3px",
                            backgroundColor: error.pbg,
                            color: "#fff",
                          }}
                          size="small"
                          label={error.priority}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5">{error.count}</Typography>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>
  );
};

export default FrequentErrors;
