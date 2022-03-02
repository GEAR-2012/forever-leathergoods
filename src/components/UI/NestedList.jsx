import React, { useEffect, useState } from "react";
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const NestedList = ({ list, handleSelectSpec, handleDeleteSpec }) => {
  const [specList, setSpecList] = useState();

  // create an extended spec list with an added data to all spec (isOpen)
  useEffect(() => {
    if (list) {
      if (list.length > 0) {
        const newArr = [];
        list.forEach((spec) => {
          newArr.push({ ...spec, isOpen: false });
        });

        setSpecList(newArr);
      }
    }
  }, [list]);

  const openNestedListHandler = (spec, i) => {
    // clone the spec object & delete the 'isOpen' property from it
    const newSpec = { ...spec };
    delete newSpec.isOpen;
    // calling a prop function
    handleSelectSpec(newSpec);
    // set the corresponding open state
    setSpecList((prevState) => {
      return prevState.map((state) => {
        if (state.index === i) {
          return { ...state, isOpen: !state.isOpen };
        } else {
          return state;
        }
      });
    });
  };

  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: "100%", backgroundColor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Specification List
        </ListSubheader>
      }
    >
      {specList?.map((spec) => {
        let specIndex = 0;
        let specName = "";
        let values = [];

        for (const [key, value] of Object.entries(spec)) {
          if (key === "index") {
            specIndex = value;
          } else if (key !== "id" && key !== "createdAt" && key !== "modifiedAt" && key !== "isOpen") {
            specName = key;
            values = value;
          }
        }

        return (
          <div key={specIndex}>
            <ListItem
              secondaryAction={
                <IconButton onClick={() => handleDeleteSpec(spec.id, specName)} edge="end" aria-label="delete">
                  <DeleteForeverIcon color="error" />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => openNestedListHandler(spec, specIndex)}>
                <ListItemText primary={`${specIndex}. ${specName}`} />
              </ListItemButton>
            </ListItem>
            <Collapse in={spec.isOpen} timeout="auto" unmountOnExit>
              <List sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }} component="div" disablePadding>
                {values.map((value) => {
                  return <ListItemText key={value} sx={{ pl: 6 }} primary={`- ${value}`} />;
                })}
              </List>
            </Collapse>
          </div>
        );
      })}
    </List>
  );
};

export default NestedList;
