import React, { useState } from "react";
import { Button, ButtonBase, Grid, IconButton, List, ListItem, Typography } from "@material-ui/core";
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

const Specifications = () => {
  const classes = useStyles();

  const { confirm, setConfirm } = AppState();

  const [buttonText, setButtonText] = useState("create new specification");
  const [specification, setSpecification] = useState(null);
  const [selectedSpecification, setSelectedSpecification] = useState(null);
  const [specificationToUpdate, setSpecificationToUpdate] = useState(null);

  const [specificationsToDelete, setSpecificationsToDelete] = useState();
  const { specifications } = useFirestore();

  useCreateDocument("specifications", specification);
  useOverWriteDocument("specifications", specificationToUpdate?.id, specificationToUpdate?.doc);
  useDeleteDocument("specifications", specificationsToDelete?.id);

  const handleSelectSpec = (spec) => {
    setButtonText("update specification");
    setSelectedSpecification(spec);
  };

  // effect used to delete a specification
  useEffect(() => {
    if (confirm.response && selectedSpecification) {
      setSpecificationsToDelete(selectedSpecification);
    }
  }, [confirm.response, selectedSpecification]);

  const handleDeleteSpec = (specId, specName) => {
    const specification = specifications.filter((spec) => spec.id === specId)[0];
    setSelectedSpecification(specification);
    setConfirm({
      open: true,
      message: `Are you sure you want to delete the specification "${specName}"?`,
      response: false,
    });
  };

  const handleReset = () => {
    setSelectedSpecification(undefined);
    setButtonText("create new specification");
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Specification CRUD
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <SpecificationForm
          selectedSpecification={selectedSpecification}
          setSelectedSpecification={setSelectedSpecification}
          setSpecification={setSpecification}
          setSpecificationToUpdate={setSpecificationToUpdate}
          setButtonText={setButtonText}
          buttonText={buttonText}
        />
        {/* Reset button */}
        <Button fullWidth onClick={handleReset} type="button" variant="contained" color="secondary">
          Reset
        </Button>
      </Grid>

      {/* Existing Specification List */}
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

export default Specifications;
