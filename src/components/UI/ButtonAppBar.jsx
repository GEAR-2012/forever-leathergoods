import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import BrandLogo from "../BrandLogo";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  brandContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  brandLogo: {
    padding: theme.spacing(2),
    fill: theme.palette.primary.main,
    fillRule: "evenodd",
    clipRule: "evenodd",
    strokeLinejoin: "round",
    strokeMiterlimit: 2,
    cursor: "pointer",
    transition: "all 1s",
  },
}));

const ButtonAppBar = ({ setDrawerOpen }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = AppState();

  // brand logo getting smaller when the window scrolled up
  const initHeight = 100;
  const smallHeight = 40;
  const [logoHeight, setLogoHeight] = useState(initHeight);

  const listenToScroll = () => {
    let offset = window.pageYOffset;
    if (offset < initHeight - smallHeight) {
      setLogoHeight(initHeight - offset);
    } else {
      setLogoHeight(smallHeight);
    }
  };

  window.addEventListener("scroll", listenToScroll);

  const handleChangeStyleMode = () => {
    setDarkMode((prevState) => !prevState);
  };

  return (
    <AppBar color="inherit" position="fixed">
      <Toolbar>
        <div>
          {/* Dark Mode Button */}
          {!darkMode && (
            <IconButton aria-label="dark mode" onClick={handleChangeStyleMode}>
              <Brightness4Icon fontSize="medium" color="primary" />
            </IconButton>
          )}
          {/* Light Mode Button */}
          {darkMode && (
            <IconButton aria-label="light mode" onClick={handleChangeStyleMode}>
              <Brightness7Icon fontSize="medium" color="primary" />
            </IconButton>
          )}
        </div>

        <div className={classes.brandContainer}>
          <IconButton aria-label="brand logo" onClick={() => navigate("/")} className={classes.brandLogo}>
            <BrandLogo height={logoHeight} />
          </IconButton>
        </div>

        <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={() => setDrawerOpen(true)}>
          <MenuIcon fontSize="large" color="primary" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ButtonAppBar;
