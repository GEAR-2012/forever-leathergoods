import React, { useState, useEffect } from "react";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, makeStyles, TextField } from "@material-ui/core";
import { AppState } from "../../context/app-context";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ProgressBar from "../UI/ProgressBar";
import { timestamp } from "../../firebase/config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const CategoryForm = ({ category, setCategory, buttonText }) => {
  const { picUrls, setPicUrls, setStorageFolder } = AppState();

  // reset picture url array in app-context
  useEffect(() => {
    setStorageFolder("categoryPictures"); // the folder for pictures in firebase storage
    const cleanup = () => {
      setPicUrls([]);
    };
    return cleanup;
  }, [setPicUrls, setStorageFolder]);

  // Input values & errors
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameError, setCategoryNameError] = useState("");
  // picture
  const [addPicture, setAddPicture] = useState(null);
  const [addPictureError, setAddPictureError] = useState("");

  // set the fields if the form used for update a product
  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setPicUrls(category.pictureList);
    }
  }, [category, setPicUrls]);

  const classes = useStyles();

  const errorRequired = "This field is required";

  const handleSubmit = () => {
    // check if any field is empty
    if (!categoryName) {
      setCategoryNameError(errorRequired);
      return;
    }

    if (picUrls.length === 0) {
      setAddPictureError("One or more picture is required");
      return;
    }

    if (categoryName) {
      // setting the category object to upload / update
      if (category) {
        // update existing
        setCategory({
          id: category.id,
          doc: {
            categoryName,
            pictureList: picUrls,
            modifiedAt: timestamp,
          },
        });
      } else {
        // upload new
        setCategory({
          categoryName,
          pictureList: picUrls,
          creratedAt: timestamp,
        });
      }

      // Reset fields
      setCategoryName("");
      // ***
      setPicUrls([]);
    }
  };

  const handleChangeCatName = (e) => {
    setCategoryNameError("");
    setCategoryName(e.target.value);
  };

  const handleBlurCatName = () => {
    const value = categoryName.trim();
    setCategoryName(value);
    if (value) {
      setCategoryNameError("");
    } else {
      setCategoryNameError(errorRequired);
    }
  };

  const handleChangePictureList = (e) => {
    const inp = e.target;
    const types = ["image/png", "image/jpeg"];
    const selected = inp.files[0];

    if (selected && types.includes(selected.type)) {
      setAddPicture(selected);
      setAddPictureError("");
      inp.value = "";
    } else {
      setAddPicture(null);
      setAddPictureError("Please select an image file (png or jpeg)");
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      {/* Category Name */}
      <TextField
        error={!!categoryNameError}
        helperText={categoryNameError}
        required
        onChange={handleChangeCatName}
        onBlur={handleBlurCatName}
        value={categoryName}
        label="Category Name"
        variant="outlined"
      />

      {/* Pictures */}
      <FormControl error={!!addPictureError} required variant="outlined">
        <InputLabel>Add Pictures:</InputLabel>
        <input style={{ display: "none" }} id="picture" type="file" onChange={handleChangePictureList} />
        <label htmlFor="picture" style={{ textAlign: "right" }}>
          <IconButton color="primary" aria-label="upload picture" component="span">
            <AddCircleOutlineIcon />
          </IconButton>
        </label>
        {addPictureError && <FormHelperText>{addPictureError}</FormHelperText>}
      </FormControl>
      {addPicture && <ProgressBar addPicture={addPicture} setAddPicture={setAddPicture} />}
      <Button onClick={handleSubmit} type="button" variant="contained" color="primary">
        {buttonText}
      </Button>
    </form>
  );
};

export default CategoryForm;
