import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper elevation={4} sx={{ display: "grid", justifyItems: "center", gap: 3, textAlign: "center", p: 3 }}>
          <Typography variant="h3">404 Error</Typography>
          <Typography variant="h6">
            The page you <br /> requested was not found.
          </Typography>
          <Typography variant="h5">
            Don't panic. <br /> Click on our Brand logo.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
