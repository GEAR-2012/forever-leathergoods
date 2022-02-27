import React from "react";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "2rem auto",
    justifyContent: "center",
  },
}));

const ProgressCircle = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={60} thickness={4} color="secondary" />
    </div>
  );
};

export default ProgressCircle;
