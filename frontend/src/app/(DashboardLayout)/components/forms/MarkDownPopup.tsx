import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import MarkdownEditor from "@uiw/react-markdown-editor";

interface MarkDownPopupProps {
  errorData: any;
}

const handleSubmitMarkdown = async (
  markdown: string,
  errorID: string,
  commands: string[]
) => {
  console.log(
    JSON.stringify({
      groupId: errorID,
      description: markdown,
      commands: commands,
    })
  );
  const res = await fetch("http://localhost:3001/writeSolution", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      groupId: errorID,
      description: markdown,
      commands: commands,
    }),
  });
};
const getCommands = (markdown: string) => {
  const bulletPointRegex = /(?:^|\n)[\*\-\+] (.+)/g;
  const commands: string[] = [];
  let match;
  while ((match = bulletPointRegex.exec(markdown)) !== null) {
    commands.push(match[1].trim());
  }
  return commands;
};

const MarkDownPopup: React.FC<MarkDownPopupProps> = ({ errorData }) => {
  const [markdown, setMarkdown] = React.useState<string>("");
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        Error Details
      </Typography>
      <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
        <strong>Command:</strong>{" "}
        <Typography component="span" sx={{ color: "blue" }}>
          {errorData.representative.command}
        </Typography>
      </Typography>
      <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
        <strong>Error:</strong>{" "}
        <Typography component="span" sx={{ color: "red" }}>
          {errorData.representative.error}
        </Typography>
      </Typography>
      <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
        <strong>ID:</strong> {errorData._id}
      </Typography>
      <MarkdownEditor
        height="400px"
        width="600px"
        onChange={(value) => setMarkdown(value || "")}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => {
          console.log(markdown);
          handleSubmitMarkdown(markdown, errorData._id, getCommands(markdown));
        }}
      >
        Submit Solution
      </Button>
    </Box>
  );
};

export default MarkDownPopup;
