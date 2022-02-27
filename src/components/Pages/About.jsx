import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Avatar, Button, Divider, Grid, List, ListItem, ListItemIcon, Typography } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { deepOrange } from "@mui/material/colors";
import ProgressCircle from "../UI/ProgressCircle";
import ReactIdSwiper from "../UI/ReactIdSwiper";
import useListenToDoc from "../../hooks/use-listen-to-doc";
import AvatarPicture from "../../images/My avatar_400x400.jpg";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainImage: {
    maxWidth: "100%",
  },
}));

const collectionName = "about";
const folderMain = "main";
const folderGallery = "gallery";

const About = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isAdmin } = AppState();

  // local states
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState();
  const [galleryImages, setGalleryImages] = useState();

  // custom hooks
  const aboutMainDoc = useListenToDoc(collectionName, folderMain);
  const aboutGalleryDoc = useListenToDoc(collectionName, folderGallery);

  // set 'isLoading' state
  useEffect(() => {
    if (mainImage && galleryImages) {
      setIsLoading(false);
    }
    return () => {
      setIsLoading(true);
    };
  }, [mainImage, galleryImages]);

  // set the main image & gallery images into local state
  useEffect(() => {
    // main
    if (aboutMainDoc) {
      if (aboutMainDoc.hasOwnProperty("pictureList")) {
        // get a random image from 'pictureList'
        const images = aboutMainDoc.pictureList;
        const image = images[Math.floor(Math.random() * images.length)];
        setMainImage(image);
      }
    }

    // gallery
    if (aboutGalleryDoc) {
      if (aboutGalleryDoc.hasOwnProperty("pictureList")) {
        setGalleryImages(aboutGalleryDoc.pictureList);
      }
    }
  }, [aboutMainDoc, aboutGalleryDoc]);

  // clean up
  useEffect(() => {
    return () => {
      setMainImage(undefined);
      setGalleryImages(undefined);
    };
  }, []);

  return (
    <Grid container spacing={6} justifyContent="center">
      {/*  Title  */}
      <Grid className={classes.titleBar} item xs={12}>
        <Typography variant="h4">Our Story</Typography>
        {isAdmin && (
          <Button onClick={() => navigate("/updateaboutpictures")} variant="contained" color="primary">
            Modify Pictures
          </Button>
        )}
      </Grid>

      {/*  Divider  */}
      <Grid item xs={12}>
        <Divider style={{ margin: "1rem 0" }} />
      </Grid>

      {/*  Loading  */}
      {isLoading && (
        <Grid item xs={12} md={6}>
          <ProgressCircle />
        </Grid>
      )}

      {/*  Main Pic to Left  */}
      {!isLoading && (
        <Grid item xs={12} md={6}>
          <img className={classes.mainImage} src={mainImage.url} alt={mainImage.name} />
        </Grid>
      )}

      {/*  About / Story text  */}
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" align="justify" paragraph>
          My journey started with a single eyelash tweezers whitch was dropped by my wife and I was needed to repair it.
          After I finished the tweezer repair job I tought I could make a pouch for it (from leftover leather which was
          hanging around in my woodworking workshop) to protect the twizeers from further damage.
        </Typography>
        <Typography variant="subtitle1" align="justify" paragraph>
          And that was it, I immediately fall in love with leather craft although my first pouch was rather ugly than
          neat.
        </Typography>
        <Typography variant="subtitle1" align="justify" paragraph>
          And so it's began... I ordered a few leather work tool from internet and I started to make various leather
          stuff like lighter case, stitching chisel case, etc. and of course leather wallets bags key tag for my family
          members. And I just made to much wallets and card holders But my enthusiasm hasn't vanished.
        </Typography>
        <Typography variant="subtitle1" align="justify" paragraph>
          So I started my humble undertaking and I started to sell my products first on Etsy and eBay later in Our
          physical shop and finally on my website.
        </Typography>
        <Typography variant="subtitle1" align="justify" paragraph>
          My customers have given me the courage and perseverance to continue working. As a web developer who sits in
          front of a computer all day, variety comes in handy and the two types of work complement each other well and
          bring peace to my soul as well.
        </Typography>
        <Avatar
          variant="rounded"
          sx={{ width: 64, height: 64, bgcolor: deepOrange[500] }}
          alt="Sandor Tudja"
          src={AvatarPicture}
        />
        <Typography variant="caption">Sandor / Forever Leather Goods owner /</Typography>
      </Grid>

      {/*  Loading  */}
      {isLoading && (
        <Grid item xs={12}>
          <ProgressCircle />
        </Grid>
      )}

      {/*  Picture Carousel  */}
      {!isLoading && (
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Workshop Pictures
          </Typography>
          <ReactIdSwiper pictures={galleryImages} />
        </Grid>
      )}
      {/*  Contact  */}
      <Grid item xs={12}>
        <Typography variant="h5">Contact Us One way or another:</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <PhoneIphoneIcon />
            </ListItemIcon>
            <Typography variant="body1">07 48048 8864</Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AlternateEmailIcon />
            </ListItemIcon>
            <Typography variant="body1">forever.leather.goods@gmail.com</Typography>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default About;
