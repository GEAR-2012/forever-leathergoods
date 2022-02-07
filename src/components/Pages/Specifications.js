import React, { useState } from "react";
import { ButtonBase, Grid, IconButton, List, ListItem, Typography } from "@material-ui/core";
import useCreateDocument from "../../hooks/useCreateDocument";
import SpecificationForm from "../FormUtilities/SpecificationForm";
import useFirestore from "../../hooks/useFirestore";
import useOverWriteDocument from "../../hooks/useOverWriteDocument";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import useDeleteDocument from "../../hooks/useDeleteDocument";
import { AppState } from "../../context/app-context";
import { useEffect } from "react";

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
  specListDeleteButton: {
    color: theme.palette.primary.main,
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
  useCreateDocument("specifications", specToCreate);
  useOverWriteDocument("specifications", specToUpdate?.id, specToUpdate?.doc);
  useDeleteDocument("specifications", specToDelete?.id);

  const handleSelectSpec = (spec) => {
    setButtonText("update spec");
    setSelectedSpec(spec);
  };

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
                    onClick={() => handleDeleteSpec(spec.id, specName)}
                  >
                    <DeleteIcon />
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
