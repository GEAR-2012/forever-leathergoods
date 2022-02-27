import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, Card, CardActions, CardMedia, ImageListItem } from "@mui/material";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import clsx from "clsx";

// there is two mode used by this component trough prop:
// vertical for vertical devices
// horizontal for horizontal devices

const contHeight = 600;
const contHeightSmall = 400;
const contGap = 16;
const thumbSize = 60;
const thumbGap = 8;

const useStyles = makeStyles((theme) => ({
  mainCont: {
    width: "100%",
    height: contHeight,
    display: "grid",
    gap: contGap,
    justifyItems: "start",
  },
  mainContHorizontal: {
    [theme.breakpoints.down("lg")]: {
      height: contHeightSmall,
    },
    gridTemplateColumns: "auto 1fr",
    gridTemplateRows: "1fr",
    gridTemplateAreas: "'thumbs main'",
  },
  mainContVertical: {
    [theme.breakpoints.down("sm")]: {
      height: contHeightSmall,
    },
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr auto",
    gridTemplateAreas: "'main' 'thumbs'",
  },
  thumbCont: {
    width: "100%",
    gridArea: "thumbs",
    overflow: "scroll",
    /* Hide scrollbar for Chrome, Safari and Opera */
    "&::-webkit-scrollbar": {
      display: "none",
    },
    /* Hide scrollbar for IE, Edge and Firefox */
    msOverflowStyle: "none" /* IE and Edge */,
    scrollbarWidth: "none" /* Firefox */,
  },
  thumbContHorizontal: {
    display: "block",
  },
  thumbContVertical: {
    display: "inline-flex",
  },
  thumbnails: {
    margin: 0,
    padding: 0,
    display: "flex",
    gap: thumbGap,
  },
  thumbnailsHorizontal: {
    flexDirection: "column",
  },
  thumbnailsVertical: {
    flexDirection: "row",
  },
  thumbnail: {
    width: `${thumbSize}px !important`,
    height: `${thumbSize}px !important`,
    overflow: "hidden",
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    opacity: 0.6,
  },
  thumbnailActive: {
    opacity: 1,
    borderWidth: 2,
  },
  mainImage: {
    gridArea: "main",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  navBtnsCont: {
    justifyContent: "space-between",
    position: "absolute",
    top: "50%",
    padding: "0.5rem !important",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
  },
  navBtns: {
    margin: "0 !important",
    minWidth: "0 !important",
    fontSize: "1.6rem !important",
    borderRadius: "50% !important",
    backgroundColor: "rgba(0, 0, 0, 0.05) !important",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1) !important",
    },
  },
  navBtnsHorizontal: {
    padding: "20px !important",
  },
  navBtnsVertical: {
    padding: "10px !important",
  },
  navBtnIcon: {
    fill: "white",
    stroke: "black",
    strokeWidth: 6,
  },
}));

const MyCarousel = ({ isVertical, pictures, onImageClick }) => {
  const classes = useStyles();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imageCount = pictures.length;

  const activateImage = (i) => {
    setActiveImageIndex(i);
    const thumbCont = document.getElementById("thumb-cont");
    const contWidth = thumbCont.offsetWidth;
    const a = i * (thumbSize + thumbGap) + thumbSize / 2;
    const b = a - contHeight / 2;
    const c = a - contWidth / 2;
    if (isVertical) {
      thumbCont.scroll({ top: 0, left: c, behavior: "smooth" });
    } else {
      thumbCont.scroll({ top: b, left: 0, behavior: "smooth" });
    }
  };

  const thumbClickHandler = (i) => {
    activateImage(i);
  };

  const leftArrowClickHandler = () => {
    let i;
    if (activeImageIndex === 0) {
      i = imageCount - 1;
    } else {
      i = activeImageIndex - 1;
    }
    activateImage(i);
  };

  const rightArrowClickHandler = () => {
    let i;
    if (activeImageIndex === imageCount - 1) {
      i = 0;
    } else {
      i = activeImageIndex + 1;
    }
    activateImage(i);
  };

  const imageClickHandler = (e) => {
    const id = e.target.id;
    if (id === "card-actions" || id === "card-media") {
      onImageClick(activeImageIndex);
    }
  };

  return (
    <div className={clsx(classes.mainCont, isVertical ? classes.mainContVertical : classes.mainContHorizontal)}>
      {/* Main Image */}
      <Card className={classes.mainImage}>
        <CardActions id="card-actions" onClick={imageClickHandler} className={classes.navBtnsCont}>
          <Button
            onClick={leftArrowClickHandler}
            className={clsx(classes.navBtns, isVertical ? classes.navBtnsVertical : classes.navBtnsHorizontal)}
          >
            <FaChevronCircleLeft className={classes.navBtnIcon} />
          </Button>
          <Button
            onClick={rightArrowClickHandler}
            className={clsx(classes.navBtns, isVertical ? classes.navBtnsVertical : classes.navBtnsHorizontal)}
          >
            <FaChevronCircleRight className={classes.navBtnIcon} />
          </Button>
        </CardActions>
        <CardMedia
          id="card-media"
          component="img"
          alt={pictures[activeImageIndex].name}
          height="100%"
          image={pictures[activeImageIndex].url}
          onClick={imageClickHandler}
        />
      </Card>

      {/* Thumbnails */}
      <div
        id="thumb-cont"
        className={clsx(classes.thumbCont, isVertical ? classes.thumbContVertical : classes.thumbContHorizontal)}
      >
        <ul
          className={clsx(classes.thumbnails, isVertical ? classes.thumbnailsVertical : classes.thumbnailsHorizontal)}
        >
          {pictures.map((item, index) => (
            <ImageListItem
              id={item.url}
              onClick={() => thumbClickHandler(index)}
              key={item.url}
              className={clsx(index === activeImageIndex && classes.thumbnailActive, classes.thumbnail)}
            >
              <img
                src={`${item.url}?w=${thumbSize}&h=${thumbSize}&fit=crop&auto=format`}
                srcSet={`${item.url}?w=${thumbSize}&h=${thumbSize}&fit=crop&auto=format&dpr=2 2x`}
                alt={item.name}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyCarousel;
