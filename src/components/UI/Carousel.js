import { Grid, Typography } from "@material-ui/core";
import React from "react";

const Carousel = ({ pictures }) => {
  return (
    <Grid container style={{ margin: "2rem auto" }}>
      <Grid item xs={12} style={{ display: "grid", placeItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Workshop Pictures
        </Typography>
      </Grid>
      <Grid item container xs={12} justifyContent="center">
        <Grid item xs={12}></Grid>
      </Grid>
    </Grid>
  );
};

export default Carousel;
