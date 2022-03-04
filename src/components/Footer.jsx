import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaEtsy, FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <AppBar position="static" color="inherit" sx={{ py: 2, display: "grid", gap: 1 }}>
      <Toolbar sx={{ padding: 0, minHeight: "0 !important", display: "flex", gap: 2, justifyContent: "center" }}>
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
      <Toolbar sx={{ padding: 0, minHeight: "0 !important", display: "flex", gap: 1, justifyContent: "center" }}>
        <FaRegCopyright />
        <Typography variant="body2">GEAR webdev {year}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
