import React, { useState } from "react";
import SwipeableTemporaryDrawer from "./UI/SwipeableTemporaryDrawer";
import ButtonAppBar from "./UI/ButtonAppBar";
import { Box } from "@mui/material";

const SideDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box>
      <ButtonAppBar setDrawerOpen={setDrawerOpen} />
      <SwipeableTemporaryDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </Box>
  );
};

export default SideDrawer;
