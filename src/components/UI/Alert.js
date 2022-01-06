import { Snackbar } from "@material-ui/core";
import React from "react";
import { AppState } from "../../context/app-context";
import Alerttt from "@material-ui/lab/Alert";

const Alert = () => {
  const { alert, setAlert } = AppState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ open: false });
  };

  return (
    <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
      <Alerttt onClose={handleClose} elevation={10} variant="filled" severity={alert.type}>
        {alert.message}
      </Alerttt>
    </Snackbar>
  );
};

export default Alert;
