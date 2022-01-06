import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { Grid, IconButton, ImageListItemBar, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { AppState } from "../../context/app-context";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase/config";

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
  itemBar: {
    height: "auto",
  },
  icon: {},
}));

const PreviewImageList = () => {
  const classes = useStyles();

  const { setAlert, picUrls, setPicUrls, storageFolder } = AppState();
  console.log(picUrls);
  const itemData = picUrls?.map((pic) => {
    return {
      ...pic,
      author: "Forever Leather Goods",
      cols: 1,
    };
  });

  const handleDelete = (item) => {
    // references
    const fileRef = ref(storage, storageFolder + "/" + item.title);

    // delete the file
    deleteObject(fileRef)
      .then(() => {
        setAlert({
          open: true,
          message: "picture deleted",
          type: "success",
        });
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      });

    // filtering url list
    setPicUrls((prevState) => {
      const newState = prevState.filter((elem) => elem.title !== item.title);
      return newState;
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item>
        <Typography variant="h5">Preview Images</Typography>
      </Grid>
      <Grid item className={classes.root}>
        <ImageList rowHeight={160} className={classes.imageList} cols={3}>
          {itemData &&
            itemData.map((item) => (
              <ImageListItem key={item.url} cols={item.cols || 1}>
                <img src={item.url} alt={item.title} />
                <ImageListItemBar
                  className={classes.itemBar}
                  title={item.title}
                  subtitle={item.author}
                  actionIcon={
                    <IconButton
                      onClick={() => handleDelete(item)}
                      color="secondary"
                      aria-label={`info about ${item.title}`}
                      className={classes.icon}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};

export default PreviewImageList;
