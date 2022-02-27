import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, Typography, IconButton, List, ListItem, ButtonBase } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SpecificationForm from "../FormUtilities/SpecificationForm";
import useFirestore from "../../hooks/useFirestore";
import useCreateDoc from "../../hooks/use-create-doc";
import useUpdateDoc from "../../hooks/use-update-doc";
import useDeleteDoc from "../../hooks/use-delete-doc";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  specListItem: {
    justifyContent: "space-between",
    gap: 40,
  },
  specListData: {
    display: "flex",
    color: "primary",
    gap: 20,
  },
}));

const Specs = () => {
  const classes = useStyles();
  const { confirm, setConfirm } = AppState();
  const { specifications } = useFirestore();

  const [buttonText, setButtonText] = useState("create new spec");

  // state to hold user selected spec from spec list
  const [selectedSpec, setSelectedSpec] = useState(null);

  // states for pre select a spec for a operation
  const [preSelectToCreate, setPreSelectToCreate] = useState(null);
  const [preSelectToUpdate, setPreSelectToUpdate] = useState(null);
  const [preSelectToDelete, setPreSelectToDelete] = useState(null);

  // states for trigger hooks
  const [specToCreate, setSpecToCreate] = useState(null);
  const [specToUpdate, setSpecToUpdate] = useState(null);
  const [specToDelete, setSpecToDelete] = useState(null);

  // state for form state :)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // hooks
  useCreateDoc("specifications", specToCreate);
  useUpdateDoc("specifications", specToUpdate?.id, specToUpdate?.doc);
  useDeleteDoc("specifications", specToDelete?.id);

  // effect used to CREATE a spec
  useEffect(() => {
    if (preSelectToCreate) {
      setSpecToCreate(preSelectToCreate);
      setIsFormSubmitted(true);
    }
  }, [preSelectToCreate]);

  // effect used to UPDATE a spec
  useEffect(() => {
    if (confirm.response && preSelectToUpdate) {
      setSpecToUpdate(preSelectToUpdate);
      setIsFormSubmitted(true);
    }
  }, [confirm.response, preSelectToUpdate]);

  // effect used to DELETE a spec
  useEffect(() => {
    if (confirm.response && preSelectToDelete) {
      setSpecToDelete(preSelectToDelete);
    }
  }, [confirm.response, preSelectToDelete]);

  const handleSelectSpec = (spec) => {
    setButtonText("update spec");
    setSelectedSpec(spec);
  };

  const handleDeleteSpec = (specId, specName) => {
    const spec = specifications.find((spec) => spec.id === specId);
    setPreSelectToDelete(spec);
    setConfirm({
      open: true,
      message: `Are you sure you want to delete the spec "${specName}"?`,
      response: false,
    });
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Spec CRUD operations
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <SpecificationForm
          isFormSubmitted={isFormSubmitted}
          setIsFormSubmitted={setIsFormSubmitted}
          selectedSpec={selectedSpec}
          setSelectedSpec={setSelectedSpec}
          setPreSelectToCreate={setPreSelectToCreate}
          setPreSelectToUpdate={setPreSelectToUpdate}
          setButtonText={setButtonText}
          buttonText={buttonText}
        />
      </Grid>

      {/* Existing Spec List */}
      <Grid item xs={12} md={6}>
        <List>
          {specifications &&
            specifications.map((spec) => {
              let specIndex = 0;
              let specName = "";
              let values = [];

              for (const [key, value] of Object.entries(spec)) {
                if (key === "index") {
                  specIndex = value;
                } else if (key !== "id" && key !== "createdAt" && key !== "modifiedAt") {
                  specName = key;
                  values = value;
                }
              }
              const specValues = values.join(", ");

              return (
                <ListItem className={classes.specListItem} key={specIndex}>
                  <ButtonBase className={classes.specListData} onClick={() => handleSelectSpec(spec)}>
                    <Typography>{specIndex}:</Typography>
                    <Typography>{specName}:</Typography>
                    <Typography>{specValues}</Typography>
                  </ButtonBase>
                  <IconButton
                    className={classes.specListDeleteButton}
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSpec(spec.id, specName)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </ListItem>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
};

export default Specs;
