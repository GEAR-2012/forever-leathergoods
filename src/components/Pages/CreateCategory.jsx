import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import CategoryForm from "../FormUtilities/CategoryForm";
import useCreateDoc from "../../hooks/use-create-doc";
import { AppState } from "../../context/app-context";

// checks for existing category name if match found return true else false
const checkSameCategories = (newCat, oldCategories) => {
  const match = oldCategories.find((oldCat) => oldCat.categoryName === newCat.categoryName);
  if (match !== undefined) {
    return true;
  } else {
    return false;
  }
};

const CreateCategory = () => {
  const navigate = useNavigate();

  const { getCategories, setAlert } = AppState();

  // this state holds the category datas
  const initUploadData = { categoryName: "", pictureList: [] };
  const [categoryToCreate, setCategoryToCreate] = useState(initUploadData); // to send the form
  const [category, setCategory] = useState(); // to trigger hook

  // create a new category & redirect to add pictures to it
  useCreateDoc("categories", category).then((docId) => {
    if (docId) navigate(`/updatecategory/${docId}`);
  });

  const createCategoryHandler = () => {
    const resp = checkSameCategories(categoryToCreate, getCategories);

    if (resp) {
      setAlert({
        open: true,
        message: `Category with the name of ${categoryToCreate.categoryName} is already exist.`,
        type: "warning",
      });
      return;
    }

    // if category name not exists yet:
    setCategory(categoryToCreate); // trigger 'useCreateDoc'
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Create a new Category
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <CategoryForm
          inputData={categoryToCreate}
          setInputData={setCategoryToCreate}
          buttonText="create category"
          onSubmit={createCategoryHandler}
        />
      </Grid>
    </Grid>
  );
};

export default CreateCategory;
