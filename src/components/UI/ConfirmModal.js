import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { AppState } from "../../context/app-context";
import { Button, ButtonGroup, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(3, 6, 4),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
    alignItems: "center",
    maxWidth: 500,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 4, 3),
      maxWidth: "80%",
    },
  },
  buttonGroup: {
    gap: theme.spacing(1),
  },
}));

const ConfirmModal = () => {
  const classes = useStyles();
  const { confirm, setConfirm } = AppState();

  const handleClose = () => {
    setConfirm((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const handleButtonClick = (e) => {
    const btnId = e.target.parentElement.id;
    if (btnId === "0") {
      setConfirm((prevState) => ({
        ...prevState,
        response: false,
      }));
    } else if (btnId === "1") {
      setConfirm((prevState) => ({
        ...prevState,
        response: true,
      }));
    }
    setConfirm((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={confirm.open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={confirm.open}>
          <Paper variant="outlined" elevation={4} className={classes.paper}>
            <Typography variant="h6">{confirm.message}</Typography>
            <ButtonGroup disableElevation className={classes.buttonGroup} fullWidth variant="contained" color="primary">
              <Button variant="contained" color="primary" id="1" onClick={handleButtonClick}>
                yes
              </Button>
              <Button variant="contained" color="primary" id="0" onClick={handleButtonClick}>
                cancel
              </Button>
            </ButtonGroup>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
