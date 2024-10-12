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
import { errorData } from "../../page";

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

const products = [
  {
    id: "1",
    name: "Sunil Joshi",
    post: "Web Designer",
    pname: "Elite Admin",
    priority: "Low",
    pbg: "primary.main",
    budget: "3.9",
  },
  {
    id: "2",
    name: "Andrew McDownland",
    post: "Project Manager",
    pname: "Real Homes WP Theme",
    priority: "Medium",
    pbg: "secondary.main",
    budget: "24.5",
  },
  {
    id: "3",
    name: "Christopher Jamil",
    post: "Project Manager",
    pname: "MedicalPro WP Theme",
    priority: "High",
    pbg: "error.main",
    budget: "12.8",
  },
  {
    id: "4",
    name: "Nirav Joshi",
    post: "Frontend Engineer",
    pname: "Hosting Press HTML",
    priority: "Critical",
    pbg: "success.main",
    budget: "2.4",
  },
];

const FrequentErrors = () => {
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
                <TableCell>
                  <Chip
                    sx={{
                      px: "3px",
                      backgroundColor: error.pbg,
                      color: "#fff",
                    }}
                    size="small"
                    label={error.priority}
                  ></Chip>
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
