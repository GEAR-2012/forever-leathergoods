import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, SwipeableDrawer, List, ListItem, ListItemText, Divider, Typography } from "@mui/material";
import { logout } from "../../firebase/firebase-auth";
import { AppState } from "../../context/app-context";

export default function SwipeableTemporaryDrawer({ drawerOpen: open, setDrawerOpen: setOpen }) {
  const navigate = useNavigate();

  const { isAdmin, currentUser, setOpenAuth } = AppState();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(open);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLoginOpen = () => {
    setOpenAuth(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoAbout = () => {
    navigate("/about");
  };

  const handleProdUpload = () => {
    navigate("/createproduct");
  };

  const handleCatUpload = () => {
    navigate("/createcategory");
  };

  const handleSpecifications = () => {
    navigate("/specifications");
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {/* Public */}
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
    </Box>
  );

  return (
    <SwipeableDrawer anchor="right" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      {list()}
    </SwipeableDrawer>
  );
}
