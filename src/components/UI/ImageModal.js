import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { AppState } from "../../context/app-context";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    maxWidth: "90%",
    maxHeight: "90%",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    // maxHeight: "90%",
  },
}));

const ImageModal = () => {
  const classes = useStyles();
  const { openImageModal, setOpenImageModal, imageModalPictures, imageModalIndex } = AppState();

  const [picture, setPicture] = useState();

  useEffect(() => {
    if (imageModalPictures.length > 0 && imageModalIndex) {
      setPicture(imageModalPictures[imageModalIndex]);
    }
  }, [imageModalPictures, imageModalIndex]);

  const handleClose = () => {
    setOpenImageModal(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openImageModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openImageModal}>
          <div className={classes.paper}>
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                {/**/}
                {picture && <img className={classes.image} src={picture.url} alt={picture.title} />}
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ImageModal;
