import React from "react";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaEtsy } from "react-icons/fa";

const Footer = () => {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <IconButton
          href="https://www.etsy.com/uk/shop/ForeverLeatherGooods"
          target="_blank"
          edge="start"
          color="primary"
          aria-label="etsy icon"
        >
          <FaEtsy />
        </IconButton>
        <IconButton
          href="https://www.instagram.com/forever_leather_goods"
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
