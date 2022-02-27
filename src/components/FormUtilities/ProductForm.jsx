import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import useFirestore from "../../hooks/useFirestore";
import {
  chkCategory,
  chkDescription,
  chkName,
  chkPrice,
  chkPurchaseLink,
  chkSpecification,
} from "../../functions/form-input-checkers";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const ProductForm = ({ productGet, setInputData, buttonText, onSubmit }) => {
  const classes = useStyles();
  const { setAlert } = AppState();

  // get categories & specifications
  const [categories, setCategories] = useState();
  const [specifications, setSpecifications] = useState();
  const { categories: getCategories, specifications: getSpecifications } = useFirestore();
  const [specListKeys, setSpecListKeys] = useState([]);

  // set 'specList' & 'specListError' into local state based on 'specListKeys'
  useEffect(() => {
    const specArray = [];
    const specErrorArray = [];

    specListKeys.forEach((key) => {
      specArray.push({ [key]: "" });
      specErrorArray.push({ [key]: "" });
    });

    setSpecList(specArray);
    setSpecListError(specErrorArray);
  }, [specListKeys]);

  // set categories & specifications into local state
  // making spec list keys array
  useEffect(() => {
    if (getCategories && getSpecifications) {
      setCategories(getCategories);
      setSpecifications(getSpecifications);
      // making spec list key array
      getSpecifications.forEach((spec) => {
        for (const key of Object.keys(spec)) {
          if (key !== "index" && key !== "id") {
            setSpecListKeys((prevState) => [...prevState, key]);
          }
        }
      });
    }
  }, [getCategories, getSpecifications]);

  // Input values & errors
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [specList, setSpecList] = useState();
  const [specListError, setSpecListError] = useState();
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [purchaseLinkError, setPurchaseLinkError] = useState("");

  // set the input fields (update mode only)
  useEffect(() => {
    if (productGet && categories) {
      setCategory(productGet.category);
      setName(productGet.name);
      setDescription(productGet.description);
      //
      // get the filtered specList from 'productGet.specifications'
      // it is possible the speclist of the product is differen than the present speclist (maybe the spectlist was changed over time)
      const filledSpecList = specListKeys.map((key) => {
        let toReturn;
        const matching = productGet.specifications.find((spec) => {
          return Object.keys(spec)[0] === key;
        });

        if (matching) {
          toReturn = matching;
        }
        return toReturn;
      });
      setSpecList(filledSpecList);
      //
      setPrice(productGet.price);
      setPurchaseLink(productGet.purchaseLink);
    }
  }, [productGet, categories, specListKeys]);

  // this effect sets the inputData to send back the caller component
  useEffect(() => {
    setInputData((prevState) => ({
      ...prevState,
      category,
      name,
      description,
      specifications: specList,
      price,
      purchaseLink,
    }));
  }, [category, name, description, specList, price, purchaseLink, setInputData]);

  // This function calls input data checker functions & sets its return values (if any) into error holder local states
  // if no error returns true so the form is valid else returns false so the form is invalid
  const formChecker = () => {
    // set error values into local state so input fields can refer to their corresponding errors
    const categoryE = chkCategory(category).err;
    const nameE = chkName(name).err;
    const descriptionE = chkDescription(description).err;
    // loop through specList & check its values for errors
    // if error found push an error object into an array
    const specListE = [];
    specList.forEach((spec) => {
      const [key, value] = Object.entries(spec)[0];
      const error = chkSpecification(value).err;
      if (error) {
        specListE.push({ [key]: error });
      }
    });
    const priceE = chkPrice(price).err;
    const purchaseLinkE = chkPurchaseLink(purchaseLink).err;

    if (categoryE) {
      setCategoryError(categoryE);
      return false;
    }
    if (nameE) {
      setNameError(nameE);
      return false;
    }
    if (descriptionE) {
      setDescriptionError(descriptionE);
      return false;
    }
    if (specListE.length > 0) {
      // get the first error object from 'specListE'
      const errObj = specListE[0];
      // get the error key & error value from it
      const [key, value] = Object.entries(errObj)[0];
      // loop through the specList error local state
      // check if error object key & error state key match
      // if so set the error value into it
      setSpecListError((prevState) => {
        return prevState.map((state) => {
          const keyState = Object.keys(state)[0];
          if (keyState === key) {
            return { [keyState]: value };
          } else {
            return state;
          }
        });
      });

      return false;
    }
    if (priceE) {
      setPriceError(priceE);
      return false;
    }
    if (purchaseLinkE) {
      setPurchaseLinkError(purchaseLinkE);
      return false;
    }

    return true;
  };

  // HANDLERS
  const submitHandler = (e) => {
    e.preventDefault();
    const isFormValid = formChecker();

    if (!isFormValid) {
      setAlert({
        open: true,
        message: "The form is NOT valid YET",
        type: "warning",
      });
      return;
    } else {
      setAlert({
        open: true,
        message: "The form is valid & submitted",
        type: "success",
      });

      onSubmit();
    }
  };

  // category
  const categoryChangeHandler = (e) => {
    setCategoryError("");
    setCategory(e.target.value);
  };

  const categoryBlurHandler = () => {
    setCategory(chkCategory(category).val);
    setCategoryError(chkCategory(category).err);
  };

  // name
  const nameChangeHandler = (e) => {
    setNameError("");
    setName(e.target.value);
  };

  const nameBlurHandler = () => {
    setName(chkName(name).val);
    setNameError(chkName(name).err);
  };

  // description
  const descriptionChangeHandler = (e) => {
    setDescriptionError("");
    setDescription(e.target.value);
  };

  const descriptionBlurHandler = (e) => {
    setDescription(chkDescription(description).val);
    setDescriptionError(chkDescription(description).err);
  };

  // specifications
  const specChangeHandler = (e, ind, specName) => {
    // reset error & set value of the calling input
    let value = e.target.value;
    let valueError = "";

    // reset the error of the calling input
    setSpecListError((prevState) => {
      // find the right one from specListError
      return prevState.map((state, index) => {
        // and update it's value
        if (index !== ind) {
          return state;
        } else {
          return { [specName]: valueError };
        }
      });
    });

    // set the value of the calling input
    setSpecList((prevState) => {
      // find the right one from specList
      return prevState.map((state, index) => {
        // and update it's value
        if (index !== ind) {
          return state;
        } else {
          return { [specName]: value };
        }
      });
    });
  };

  const specBlurHandler = (ind, specName) => {
    // check the value of the calling input with a checker function
    // ...set the checked value of the calling input
    // ...set the possible error of the calling input

    let checkedInputValue;

    setSpecList((prevState) => {
      // find the right one from specList
      return prevState.map((state, index) => {
        // and update it's value
        if (index !== ind) {
          return state;
        } else {
          checkedInputValue = chkSpecification(state[specName]).val;
          return { [specName]: checkedInputValue };
        }
      });
    });

    setSpecListError((prevState) => {
      // find the right one from specListError
      return prevState.map((state, index) => {
        // and update it's value
        if (index !== ind) {
          return state;
        } else {
          const errorMessage = chkSpecification(checkedInputValue).err;
          return { [specName]: errorMessage };
        }
      });
    });
  };

  // pirce
  const priceChangeHandler = (e) => {
    setPriceError("");
    setPrice(e.target.value);
  };

  const priceBlurHandler = () => {
    setPrice(chkPrice(price).val);
    setPriceError(chkPrice(price).err);
  };

  // purchase link
  const purchaseLinkChangeHandler = (e) => {
    setPurchaseLinkError("");
    setPurchaseLink(e.target.value);
  };

  const purchaseLinkBlurHandler = () => {
    setPurchaseLink(chkPurchaseLink(purchaseLink).val);
    setPurchaseLinkError(chkPurchaseLink(purchaseLink).err);
  };

  return (
    <form onSubmit={submitHandler} className={classes.form} noValidate autoComplete="off">
      {/* Categories */}
      <FormControl error={!!categoryError} required variant="outlined">
        <InputLabel id="cat-label">Category</InputLabel>
        <Select
          labelId="cat-label"
          id="cat-select"
          value={category}
          onChange={categoryChangeHandler}
          onBlur={categoryBlurHandler}
          label="Category"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categories &&
            categories.map((cat) => {
              return (
                <MenuItem key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </MenuItem>
              );
            })}
        </Select>
        {categoryError && <FormHelperText>{categoryError}</FormHelperText>}
      </FormControl>
      {/* Product Name */}
      <TextField
        error={!!nameError}
        helperText={nameError}
        required
        onChange={nameChangeHandler}
        onBlur={nameBlurHandler}
        value={name}
        label="Product Name"
        variant="outlined"
      />
      {/* Product Description */}
      <TextField
        error={!!descriptionError}
        helperText={descriptionError}
        required
        onChange={descriptionChangeHandler}
        onBlur={descriptionBlurHandler}
        value={description}
        label="Product Description"
        variant="outlined"
        multiline
        minRows={5}
      />
      {/* Product Specifications */}
      {specifications &&
        specifications.map((spec, index) => {
          let specName;
          let specValues;
          for (const [key, value] of Object.entries(spec)) {
            if (key !== "index" && key !== "id") {
              specName = key;
              specValues = value;
            }
          }

          // get the corresponding vales from 'specList' & 'specListError'
          let specListValue = "";
          const specVal = specList
            .filter((spec) => {
              let toReturn;
              if (spec) {
                toReturn = spec[specName];
              }
              return toReturn;
            })
            .map((item) => {
              return item[specName];
            })[0];

          if (specVal) {
            specListValue = specVal;
          }

          let specListErrorValue = "";
          const specErrVal = specListError
            .filter((spec) => {
              return spec[specName];
            })
            .map((item) => {
              return item[specName];
            })[0];

          if (specErrVal) {
            specListErrorValue = specErrVal;
          }

          /* Specification */
          return (
            <FormControl key={specName} error={!!specListErrorValue} variant="outlined" required={false}>
              <InputLabel id={`${specName}-label`}>{specName}</InputLabel>
              <Select
                labelId={specName}
                id={specName}
                value={specListValue}
                onChange={(e) => specChangeHandler(e, index, specName)}
                onBlur={(e) => specBlurHandler(index, specName)}
                label={specName}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {specValues.map((specValue) => {
                  return (
                    <MenuItem key={specValue} value={specValue}>
                      {specValue}
                    </MenuItem>
                  );
                })}
              </Select>
              {specListErrorValue && <FormHelperText>{specListErrorValue}</FormHelperText>}
            </FormControl>
          );
        })}
      {/* Product Price */}
      <FormControl error={!!priceError} required>
        <InputLabel htmlFor="price">Price</InputLabel>
        <OutlinedInput
          id="price"
          value={price}
          onChange={priceChangeHandler}
          onBlur={priceBlurHandler}
          label="Price"
          startAdornment={<InputAdornment position="start">£</InputAdornment>}
        />
        {priceError && <FormHelperText>{priceError}</FormHelperText>}
      </FormControl>
      {/* Purchase Link */}
      <TextField
        error={!!purchaseLinkError}
        helperText={purchaseLinkError}
        required
        onChange={purchaseLinkChangeHandler}
        onBlur={purchaseLinkBlurHandler}
        value={purchaseLink}
        label="Purchase Link"
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary">
        {buttonText}
      </Button>
    </form>
  );
};

export default ProductForm;
