import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import CategoryForm from "../FormUtilities/CategoryForm";
import PreviewImageList from "../FormUtilities/PreviewImageList";
import useFirestore from "../../hooks/useFirestore";
import useUpdateDocument from "../../hooks/useUpdateDocument";

const UpdateCategory = () => {
  const { catid } = useParams();
  const { categories } = useFirestore();
  const [categoryToUpdate, setCategoryToUpdate] = useState("");
  const [category, setCategory] = useState(null);

  // filter the appropriate category
  useEffect(() => {
    if (categories) {
      setCategoryToUpdate(categories.find((cat) => cat.id === catid));
    }
  }, [categories]);

  useUpdateDocument("categories", category?.id, category?.doc, "/");

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Category Update
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <CategoryForm category={categoryToUpdate} setCategory={setCategory} buttonText="update the category" />
      </Grid>

      <Grid item xs={12} md={6}>
        <PreviewImageList />
      </Grid>
    </Grid>
  );
};

export default UpdateCategory;
