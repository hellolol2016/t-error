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
  // Use a Map to group and count errors by command
  const errorMap = new Map();

  errorData.forEach((item) => {
    const { command, error } = item.errorData;

    if (errorMap.has(command)) {
      errorMap.get(command).count++;
    } else {
      errorMap.set(command, { error, count: 1 });
    }
  });

  // Convert Map to array of objects
  const compiledData = Array.from(errorMap, ([command, data]) => ({
    command,
    error: data.error,
    count: data.count,
  }));

  return compiledData;
}

const FrequentErrors = () => {
  const errorData = useContext(ErrorContext) ?? [];
  const compiledData = compileData(errorData);
  compiledData.sort((a, b) => b.count - a.count);
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
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Count
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compiledData.map((error, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignitems: "center",
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

//{products.map((product) => (
//<TableRow key={product.name}>
//<TableCell>
//<Box
//sx={{
//display: "flex",
//alignItems: "center",
//}}
//>
//<Box>
//<Typography variant="subtitle1" fontWeight={600}>
//{product.name}
//</Typography>
//<Typography
//color="textSecondary"
//sx={{
//fontSize: "12px",
//}}
//>
//{product.post}
//</Typography>
//</Box>
//</Box>
//</TableCell>
//<TableCell>
//<Typography
//color="textSecondary"
//variant="subtitle1"
//fontWeight={399}
//>
//{product.pname}
//</Typography>
//</TableCell>
//<TableCell>
//<Chip
//sx={{
//px: "3px",
//backgroundColor: product.pbg,
//color: "#fff",
//}}
//size="small"
//label={product.priority}
//></Chip>
//</TableCell>
//<TableCell align="right">
//<Typography variant="h5">${product.budget}k</Typography>
//</TableCell>
//</TableRow>
//))}

export default FrequentErrors;
