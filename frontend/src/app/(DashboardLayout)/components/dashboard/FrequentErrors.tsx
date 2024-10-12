import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import MarkDownPopup from "../forms/MarkDownPopup";

interface ErrorGroup {
  representative: {
    command: string;
    error: string;
  };
  count: number;
  errors: {
    command: string;
    error: string;
  }[];
}

const FrequentErrors: React.FC = () => {
  const [errorData, setErrorData] = useState<ErrorGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<ErrorGroup | null>(null);

  useEffect(() => {
    // Fetch the error data from your API or use the provided data
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/getErrorGroups");
      const data = await response.json();
      setErrorData(data);
    };

    fetchData();
  }, []);
  const handleRowClick = (errorGroup: ErrorGroup) => {
    setSelectedError(errorGroup);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedError(null);
  };

  const parseErrorResponse = (data: ErrorGroup[]) => {
    return data.map((group, index) => (
      <TableRow key={index} onClick={() => handleRowClick(group)}>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {group.representative.command}
              </Typography>
              <Typography color="textSecondary" sx={{ fontSize: "12px" }}>
                {group.representative.error}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight={600}>
            {group.representative.error}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="subtitle1" fontWeight={600}>
            {group.count}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <DashboardCard title="Frequent Errors">
      <>
        <Box
          sx={{
            overflow: "auto",
            height: "24vh",
            width: { xs: "280px", sm: "auto" },
            // Scrollbar styling for webkit browsers (Chrome, Safari, newer versions of Edge)
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0, 0, 0, 0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(0, 0, 0, 0.3)",
            },
            // Scrollbar styling for Firefox
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
              "& tbody tr": {
                transition: "background-color 0.3s",
              },
              "& tbody tr:hover": {
                backgroundColor: "rgba(50, 50, 50, 0.1)",
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
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Count
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{parseErrorResponse(errorData)}</TableBody>
          </Table>
        </Box>
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <MarkDownPopup errorData={selectedError} />
        </Modal>
      </>
    </DashboardCard>
  );
};

export default FrequentErrors;
