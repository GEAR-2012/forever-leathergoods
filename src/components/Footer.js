import React from "react";
import { AppBar, IconButton, makeStyles, Toolbar } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";

const useStyles = makeStyles((theme) => ({
  link: {},
  menuButton: {
    color: theme.palette.primary.main,
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <IconButton
          href="https://www.facebook.com"
          target="_blank"
          edge="start"
          className={classes.menuButton}
          aria-label="facebook icon"
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="https://www.twitter.com"
          target="_blank"
          edge="start"
          className={classes.menuButton}
          aria-label="twitter icon"
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          href="https://www.instagram.com"
          target="_blank"
          edge="start"
          className={classes.menuButton}
          aria-label="instagram icon"
        >
          <InstagramIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
