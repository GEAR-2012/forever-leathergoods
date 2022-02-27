import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { AppState } from "../../context/app-context";

const AlertComponent = () => {
  const { alert, setAlert } = AppState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ open: false });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} elevation={10} variant="filled" severity={alert.type}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
