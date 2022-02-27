import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Button, TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const CategoryForm = ({ inputData, setInputData, buttonText, onSubmit }) => {
  const classes = useStyles();

  // Input values & errors
  const [categoryNameError, setCategoryNameError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // set form validity
  useEffect(() => {
    if (inputData.categoryName && !categoryNameError) {
      setIsFormValid(true);
    }
  }, [inputData.categoryName, categoryNameError]);

  const errorRequired = "This field is required";

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    onSubmit();
  };

  const catNameChangeHandler = (e) => {
    setCategoryNameError("");
    setInputData((prevState) => ({ ...prevState, categoryName: e.target.value }));
  };

  const catNameBlurHandler = () => {
    const value = inputData.categoryName.trim();

    setInputData((prevState) => ({ ...prevState, categoryName: value }));

    if (value) {
      setCategoryNameError("");
    } else {
      setCategoryNameError(errorRequired);
    }
  };

  return (
    <form onSubmit={submitHandler} className={classes.form} noValidate autoComplete="off">
      {/* Category Name */}
      <TextField
        error={!!categoryNameError}
        helperText={categoryNameError}
        required
        onChange={catNameChangeHandler}
        onBlur={catNameBlurHandler}
        value={inputData.categoryName}
        label="Category Name"
        variant="outlined"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        {buttonText}
      </Button>
    </form>
  );
};

export default CategoryForm;
