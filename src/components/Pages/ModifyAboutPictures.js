import { Divider, Grid, Typography } from "@material-ui/core";
import React from "react";
import AboutPicturesForm from "../FormUtilities/AboutPicturesForm";
import PreviewImageList from "../FormUtilities/PreviewImageList";

const ModifyAboutPictures = () => {
  return (
    <Grid container spacing={4}>
      {/* Title */}
      <Grid item xs={12}>
        <Typography variant="h3">Modify About Pictures</Typography>
      </Grid>
      {/* Divider */}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* Form */}
      <Grid item xs={12} md={6}>
        <AboutPicturesForm />
      </Grid>
      {/* Image Preview */}
      <Grid item xs={12} md={6}>
        <PreviewImageList />
      </Grid>
    </Grid>
  );
};

export default ModifyAboutPictures;
