import React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const ProgressLinear = ({ progress }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="determinate" color="secondary" value={progress} />
    </Box>
  );
};

export default ProgressLinear;
