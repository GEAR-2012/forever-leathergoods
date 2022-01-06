import { Avatar, Button, Divider, Grid, List, ListItem, ListItemIcon, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import AvatarPicture from "../../images/My avatar_400x400.jpg";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Carousel from "../UI/Carousel";
import { useState } from "react";
import { useEffect } from "react";
import ProgressCircle from "../UI/ProgressCircle";
import ReactIdSwiper from "../UI/ReactIdSwiper";
import { useNavigate } from "react-router-dom";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainPicture: {
    maxWidth: "100%",
  },
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const About = () => {
  const { isAdmin } = AppState();
  const classes = useStyles();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [mainPicture, setMainPicture] = useState();
  const [pictures, setPictures] = useState();

  useEffect(() => {
    if (mainPicture) {
      setIsLoading(false);
    }
  }, [mainPicture]);

  return (
    <Grid container spacing={2} justifyContent="center">
      {/*  Test  
      {pictures && (
        <Grid item xs={8}>
          <ReactIdSwiper pictures={pictures} />
        </Grid>
      )}*/}
      {/*  Title  */}
      <Grid className={classes.titleBar} item xs={12}>
        <Typography variant="h4">Our Story</Typography>
        {isAdmin && (
          <Button onClick={() => navigate("/modifyaboutpictures")} variant="contained" color="primary">
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
      {mainPicture && !isLoading && (
        <Grid item xs={12} md={6}>
          <img className={classes.mainPicture} src={mainPicture} alt="Main picture" />
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
        <Avatar variant="rounded" className={classes.avatarLarge} alt="Sandor Tudja" src={AvatarPicture} />
        <Typography variant="caption">Sandor / Forever Leather Goods owner /</Typography>
      </Grid>
      {/*  Loading  */}
      {isLoading && (
        <Grid item xs={12}>
          <ProgressCircle />
        </Grid>
      )}
      {/*  Picture Carousel  
      {pictures && !isLoading && (
        <Grid item xs={12}>
          <Carousel pictures={pictures} />
        </Grid>
      )}*/}
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
