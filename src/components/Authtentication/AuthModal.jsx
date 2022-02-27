import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Fade, Modal, Tab, Tabs } from "@mui/material";
import Login from "./Login";
import SignUp from "./SignUp";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    outline: "none",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    color: "white",
    borderRadius: 10,
  },
}));

const AuthModal = () => {
  const classes = useStyles();

  const { openAuth, setOpenAuth } = AppState();

  const handleClose = () => {
    setOpenAuth(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openAuth}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={openAuth}>
          <div className={classes.paper}>
            <AppBar position="static" style={{ background: "transparent", color: "white" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{
                  borderRadius: 10,
                }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>

            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <SignUp handleClose={handleClose} />}
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default AuthModal;
