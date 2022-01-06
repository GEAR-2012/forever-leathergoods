import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { AppState } from "../context/app-context";
import { logout } from "../firebase/firebase-auth";
import { Typography } from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";

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
  },
  brandLogo: {
    margin: "0 auto",
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
    navigate("/produpload");
  };

  const handleCatUpload = () => {
    setOpen(false);
    navigate("/newcategory");
  };

  const handleSpecifications = () => {
    setOpen(false);
    navigate("/specifications");
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

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
              <IconButton onClick={handleChangeStyleMode} color="primary" size="medium">
                <Brightness4Icon />
              </IconButton>
            )}
            {/* Light Mode Button */}
            {darkMode && (
              <IconButton onClick={handleChangeStyleMode} color="primary" size="medium">
                <Brightness7Icon />
              </IconButton>
            )}
          </div>

          <div className={classes.brandContainer}>
            <IconButton onClick={handleGoHome} className={classes.brandLogo}>
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
            <MenuIcon className={classes.icon} />
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
