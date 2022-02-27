import React from "react";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <IconButton
          href="https://www.facebook.com"
          target="_blank"
          edge="start"
          color="primary"
          aria-label="facebook icon"
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="https://www.twitter.com"
          target="_blank"
          edge="start"
          color="primary"
          aria-label="twitter icon"
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          href="https://www.instagram.com"
          target="_blank"
          edge="start"
          color="primary"
          aria-label="instagram icon"
        >
          <InstagramIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
