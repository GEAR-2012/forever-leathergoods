import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "1rem auto",
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
