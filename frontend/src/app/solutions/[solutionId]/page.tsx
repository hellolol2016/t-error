"use client";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Markdown editor to avoid SSR issues
const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor"), {
  ssr: false,
});

const SolutionPage = () => {
  const params = useParams();
  const { solutionId } = params;
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    // Fetch the solution markdown from the API endpoint
    const fetchSolution = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/getSolution/${solutionId}`;
        console.log(url);
        const response = await fetch(url);
        const data = await response.json();
        setMarkdown(data[0].description); // Assuming the API returns an object with a 'markdown' field
      } catch (error) {
        console.error("Error fetching solution:", error);
      }
    };

    if (solutionId) {
      fetchSolution();
    }
  }, [solutionId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "99vh",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Solution ID: {solutionId}
      </Typography>
      <Box sx={{ width: "80%", mt: 4, height: "60vh" }}>
        <MarkdownEditor
          value={markdown}
          onChange={setMarkdown}
          visible
          height="60vh"
        />
      </Box>
    </Box>
  );
};

export default SolutionPage;
