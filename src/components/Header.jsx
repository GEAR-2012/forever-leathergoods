import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, useTheme } from "@mui/styles";
import { Drawer, AppBar, Toolbar, List, Divider, IconButton, ListItem, ListItemText, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BrandLogo from "./BrandLogo";
import { logout } from "../firebase/firebase-auth";
import { AppState } from "../context/app-context";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    // backgroundColor: theme.palette.grey[900],
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  icon: {
    fontSize: 40,
    color: theme.palette.primary.main,
  },
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

const SideDrawer = () => {
  const navigate = useNavigate();

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

  const { darkMode, setDarkMode, isAdmin, currentUser, setOpenAuth } = AppState();

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleChangeStyleMode = () => {
    setDarkMode((prevState) => !prevState);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleGoHome = () => {
    setOpen(false);
    navigate("/");
  };

  const handleLoginOpen = () => {
    setOpen(false);
    setOpenAuth(true);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  const handleGoAbout = () => {
    setOpen(false);
    navigate("/about");
  };

  const handleProdUpload = () => {
    setOpen(false);
    navigate("/createproduct");
  };

  const handleCatUpload = () => {
    setOpen(false);
    navigate("/createcategory");
  };

  const handleSpecifications = () => {
    setOpen(false);
    navigate("/specifications");
  };

  return (
    <div className={classes.root}>
      <AppBar
        color="inherit"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
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
            <IconButton aria-label="brand logo" onClick={handleGoHome} className={classes.brandLogo}>
              <BrandLogo height={logoHeight} />
            </IconButton>
          </div>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon fontSize="large" color="primary" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronLeftIcon color="primary" /> : <ChevronRightIcon color="primary" />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={handleGoHome}>
            <ListItemText primary="Home / Categories" />
          </ListItem>
          {currentUser ? (
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Log Out" />
            </ListItem>
          ) : (
            <ListItem button onClick={handleLoginOpen}>
              <ListItemText primary="Login / Sign Up" />
            </ListItem>
          )}
          <ListItem button onClick={handleGoAbout}>
            <ListItemText primary="About Us" />
          </ListItem>
          {/* Only for admins */}
          {isAdmin && (
            <>
              <Divider />
              <ListItem>
                <Typography variant="h6">Admin Menu</Typography>
              </ListItem>
              <Divider />
              <ListItem button onClick={handleProdUpload}>
                <ListItemText primary="Create New Product" />
              </ListItem>
              <ListItem button onClick={handleCatUpload}>
                <ListItemText primary="Create New Category" />
              </ListItem>
              <ListItem button onClick={handleSpecifications}>
                <ListItemText primary="Specifications" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
