import React from "react";
import { makeStyles } from "@mui/styles";
import { Grid, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  imageList: {
    width: "100%",
  },
}));

const PreviewImageList = ({ itemData, onDelete }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item className={classes.root}>
        <ImageList rowHeight={160} className={classes.imageList} cols={3}>
          {itemData &&
            itemData.map((item) => (
              <ImageListItem key={item.url} cols={1}>
                <img src={item.url} alt={item.name} />

                <ImageListItemBar
                  sx={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={item.name}
                  position="bottom"
                  actionIcon={
                    <IconButton onClick={() => onDelete(item)} aria-label={`star ${item.name}`}>
                      <DeleteForeverIcon />
                    </IconButton>
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};

export default PreviewImageList;
