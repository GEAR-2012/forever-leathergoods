import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import CategoryForm from "../FormUtilities/CategoryForm";
import PreviewImageList from "../FormUtilities/PreviewImageList";
import useCreateDocument from "../../hooks/useCreateDocument";

const CreateCategory = () => {
  const [category, setCategory] = useState(null);
  useCreateDocument("categories", category);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Category Upload
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <CategoryForm setCategory={setCategory} buttonText="add new category" />
      </Grid>

      <Grid item xs={12} md={6}>
        <PreviewImageList />
      </Grid>
    </Grid>
  );
};

export default CreateCategory;
