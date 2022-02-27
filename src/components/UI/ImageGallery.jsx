import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import pictueGalleryData from "../../Data/aboutGalleryUrls.json";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    height: 600,
    width: theme.breakpoints.values.lg,
    [theme.breakpoints.down("md")]: {
      width: theme.breakpoints.values.md,
    },
  },
  imageListItem: {
    height: `${theme.breakpoints.values.lg / 5.5}px !important`,
    [theme.breakpoints.down("md")]: {
      height: `${theme.breakpoints.values.md / 5.5}px !important`,
    },
    [theme.breakpoints.down("sm")]: {
      height: `${theme.breakpoints.values.sm / 5.5}px !important`,
    },
  },
}));

const ImageGallery = () => {
  const classes = useStyles();
  const [itemData, setItemData] = useState();

  useEffect(() => {
    setItemData(pictueGalleryData);
  }, []);

  return (
    <div className={classes.root}>
      <ImageList className={classes.imageList} cols={5}>
        {itemData &&
          itemData.map((item) => (
            <ImageListItem className={classes.imageListItem} key={item.img} cols={item.cols || 1}>
              <img src={item.img} alt={item.title} />
            </ImageListItem>
          ))}
      </ImageList>
    </div>
  );
};

export default ImageGallery;
