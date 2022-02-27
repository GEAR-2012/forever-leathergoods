import { Snackbar } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react";
import { useState } from "react";

const ConfirmSnackbar = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        horizontal: "center",
        vertical: "top",
      }}
    >
      <Alert onClose={handleClose} variant="filled" severity="info" elevation={10}>
        <AlertTitle>Test Title</AlertTitle>
        message -
      </Alert>
    </Snackbar>
  );
};

export default ConfirmSnackbar;
