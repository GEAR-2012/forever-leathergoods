import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import CategoryForm from "../FormUtilities/CategoryForm";
import MasonryImageGrid from "../UI/MasonryImageGrid";
import PictureSelect from "../UI/PictureSelect";
import ProgressLinear from "../UI/ProgressLinear";
import useFirestore from "../../hooks/useFirestore";
import useUpdateDoc from "../../hooks/use-update-doc";
import useDeletePicture from "../../hooks/use-delete-picture";
import { AppState } from "../../context/app-context";

const UpdateCategory = () => {
  const { cat_id } = useParams();
  const navigate = useNavigate();

  const { progress } = AppState();

  const { categories } = useFirestore();
  const [categoryToUpdate, setCategoryToUpdate] = useState("");

  const [category, setCategory] = useState(null);
  const [picToDelete, setPicToDelete] = useState();

  // find the category to update in categories
  useEffect(() => {
    if (categories) {
      setCategoryToUpdate(categories.find((cat) => cat.id === cat_id));
    }
  }, [categories, cat_id]);

  // update category & redirect to home page
  useUpdateDoc("categories", cat_id, category).then((resp) => {
    if (resp) navigate("/");
  });

  // custom hook to delete one picture
  useDeletePicture("categories", cat_id, picToDelete);

  const deleteCategoryPictureHandler = (pic) => {
    setPicToDelete(pic);
  };

  const updateCategoryHandler = () => {
    setCategory(categoryToUpdate); // trigger 'useUpdateDoc'
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Update Category
        </Typography>
      </Grid>

      {categoryToUpdate && (
        <Grid item xs={12} md={6}>
          <CategoryForm
            inputData={categoryToUpdate}
            setInputData={setCategoryToUpdate}
            buttonText="update the category"
            onSubmit={updateCategoryHandler}
          />
        </Grid>
      )}

      {categoryToUpdate && (
        <Grid item xs={12} md={6}>
          <PictureSelect folderName="categories" docId={cat_id} />
          {/* Linear progress bar */}
          {progress !== 0 && <ProgressLinear progress={progress} />}
          {/* Image grid */}
          <MasonryImageGrid itemData={categoryToUpdate.pictureList} onDelete={deleteCategoryPictureHandler} />
        </Grid>
      )}
    </Grid>
  );
};

export default UpdateCategory;
