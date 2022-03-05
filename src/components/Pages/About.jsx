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
import { ourStory } from "../../textual data/our story";
import { ourMotto } from "../../textual data/our motto";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  mainImage: {
    maxWidth: "100%",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[8],
    borderWidth: 1,
    borderStyle: "solid",
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
      {/*  Action Button  */}
      {isAdmin && (
        <Grid item xs={12}>
          <Button onClick={() => navigate("/updateaboutpictures")} variant="contained" color="primary">
            Modify Pictures
          </Button>
        </Grid>
      )}

      {/*  Est.  */}
      <Grid item xs={12}>
        <Typography sx={{ textAlign: "center", fontSize: { xs: "1rem", md: "1.8rem" }, lineHeight: 1 }} variant="body1">
          Est. 2020
        </Typography>
      </Grid>

      {/*  Divider  */}
      <Grid item xs={12}>
        <Divider sx={{ my: 0.6 }} />
      </Grid>

      {/*  Motto  */}
      <Grid item xs={12}>
        <Typography
          sx={{ textAlign: "center", fontStyle: "italic", fontSize: { xs: "1.4rem", md: "2.2rem" }, lineHeight: 1 }}
          variant="body1"
          color="primary"
        >
          {ourMotto}
        </Typography>
      </Grid>

      {/*  Divider  */}
      <Grid item xs={12}>
        <Divider sx={{ my: 0.6 }} />
      </Grid>

      {/* Title */}
      <Grid item xs={12}>
        <Typography variant="h4">Our Story</Typography>
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
        {ourStory.map((para) => (
          <Typography
            key={para.id}
            sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
            variant="body1"
            align="justify"
            paragraph
          >
            {para.text}
          </Typography>
        ))}

        <Avatar
          variant="rounded"
          sx={{ width: 64, height: 64, bgcolor: deepOrange[500], mt: 6, mb: 2 }}
          alt="Sandor Tudja"
          src={AvatarPicture}
        />
        <Typography variant="caption">Sandor / Forever Leather Goods owner /</Typography>
      </Grid>

      {/*  Divider  */}
      <Grid item xs={12}>
        <Divider sx={{ my: 0.6 }} />
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
          <Typography variant="h4" sx={{ mb: 4 }}>
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
