import React from "react";
import { makeStyles } from "@mui/styles";
import { Modal, Fade, Grid, Button } from "@mui/material";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ReactIdSwiper from "./ReactIdSwiper";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  exitFullScreenBtn: {
    position: "absolute !important",
    padding: "1rem !important",
    minWidth: "0 !important",
    borderRadius: "50% !important",
    backgroundColor: "rgba(0, 0, 0, 0.05) !important",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1) !important",
    },
    bottom: 10,
    right: 10,
    zIndex: 100,
    fontSize: "2.6rem !important",
    color: "#fff !important",
  },
}));

const ImageModal = () => {
  const classes = useStyles();
  const { imageModal, setImageModal } = AppState();

  const handleClose = () => {
    setImageModal({
      open: false,
      pictures: [],
      index: 0,
    });
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={imageModal.open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={imageModal.open}>
          <Grid container>
            <Button onClick={handleClose} className={classes.exitFullScreenBtn}>
              <FullscreenExitIcon color="inherit" fontSize="inherit" />
            </Button>
            <Grid item xs={12}>
              <ReactIdSwiper pictures={imageModal.pictures} index={imageModal.index} />
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
};

export default ImageModal;
