import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import SpecificationForm from "../FormUtilities/SpecificationForm";
import NestedList from "../UI/NestedList";
import useCreateDoc from "../../hooks/use-create-doc";
import useUpdateDoc from "../../hooks/use-update-doc";
import useDeleteDoc from "../../hooks/use-delete-doc";
import { AppState } from "../../context/app-context";

const Specs = () => {
  const { getSpecifications, confirm, setConfirm } = AppState();

  const [specifications, setSpecifications] = useState();

  useEffect(() => {
    if (getSpecifications) {
      if (getSpecifications.length > 0) {
        setSpecifications(getSpecifications);
      }
    }
  }, [getSpecifications]);

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

      {/* Nested List */}
      {specifications && (
        <Grid item xs={12} md={6}>
          <NestedList list={specifications} handleSelectSpec={handleSelectSpec} handleDeleteSpec={handleDeleteSpec} />
        </Grid>
      )}
    </Grid>
  );
};

export default Specs;
