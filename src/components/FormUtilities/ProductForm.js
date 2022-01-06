import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@material-ui/core";
import { AppState } from "../../context/app-context";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ProgressBar from "../UI/ProgressBar";
import { timestamp } from "../../firebase/config";
import { regExpPrice, regExpUrl } from "../../reg-exp";
import useFirestore from "../../hooks/useFirestore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const ProductForm = ({ product, setProduct, buttonText }) => {
  const { picUrls, setPicUrls, storageFolder, setStorageFolder } = AppState();

  // reset picture url array in app-context
  useEffect(() => {
    setStorageFolder("productPictures"); // the folder for pictures in firebase storage
    const cleanup = () => {
      setPicUrls([]);
    };
    return cleanup;
  }, []);

  // get categories & specifications
  const [categories, setCategories] = useState();
  const [specifications, setSpecifications] = useState();
  const { categories: getCategories, specifications: getSpecifications } = useFirestore();

  useEffect(() => {
    if (getCategories && getSpecifications) {
      setCategories(getCategories);
      setSpecifications(getSpecifications);
      // making epmty arrays
      const specArray = [];
      const specErrorArray = [];
      getSpecifications.forEach((spec) => {
        for (const key of Object.keys(spec)) {
          if (key !== "index" && key !== "id") {
            specArray.push({ [key]: "" });
            specErrorArray.push({ [key]: "" });
          }
        }
      });
      setSpecList(specArray);
      setSpecListError(specErrorArray);
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
  const [isSpecListValid, setIsSpecListValid] = useState(false);
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [purchaseLinkError, setPurchaseLinkError] = useState("");
  // picture
  const [addPicture, setAddPicture] = useState(null);
  const [addPictureError, setAddPictureError] = useState("");

  // check if the specList all items contains values
  useEffect(() => {
    if (specList) {
      setIsSpecListValid(true);
      specList.forEach((spec) => {
        if (spec) {
          const specValue = Object.values(spec)[1];
          if (!specValue) setIsSpecListValid(true);
          // if (!specValue) setIsSpecListValid(false);
        }
      });
    }
  }, [specList]);

  // set the fields if the form used for update a product
  useEffect(() => {
    if (product) {
      setCategory(product.category);
      setName(product.name);
      setDescription(product.description);
      // get the filtered specList from 'product.specifications'
      const filledSpecList = specList.map((spec) => {
        const specName = Object.keys(spec)[0];
        const matching = product.specifications.filter((spec) => {
          return Object.keys(spec)[0] === specName;
        })[0];
        if (matching) {
          return matching;
        } else {
          return spec;
        }
      });
      setSpecList(filledSpecList);
      //
      setPrice(product.price);
      setPurchaseLink(product.purchaseLink);
      setPicUrls(product.pictureList);
    }
  }, [product]);

  const classes = useStyles();

  const errorRequired = "This field is required";

  const handleSubmit = () => {
    // check if any field is empty
    if (!category) {
      setCategoryError(errorRequired);
    }
    if (!name) {
      setNameError(errorRequired);
    }
    if (!description) {
      setDescriptionError(errorRequired);
    }

    if (!price) {
      setPriceError(errorRequired);
    }
    if (!purchaseLink) {
      setPurchaseLinkError(errorRequired);
    }

    if (picUrls.length === 0) {
      setAddPictureError("One or more picture is required");
    }

    if (category && name && description && isSpecListValid && price && purchaseLink && picUrls.length > 0) {
      // setting the product object to upload / update
      if (product) {
        setProduct({
          id: product.id,
          doc: {
            category,
            name,
            description,
            specifications: specList,
            price,
            purchaseLink,
            pictureList: picUrls,
            modifiedAt: timestamp,
          },
        });
      } else {
        setProduct({
          category,
          name,
          description,
          specifications: specList,
          price,
          purchaseLink,
          pictureList: picUrls,
          createdAt: timestamp,
        });
      }

      // Reset fields
      setCategory("");
      setName("");
      setDescription("");

      specList.forEach((spec, index) => {
        const specName = Object.keys(spec)[1];

        setSpecList((prevState) => {
          // find the right one from specList
          return prevState.map((state, ind) => {
            // and update it's value
            if (index !== ind) {
              return state;
            } else {
              return { [specName]: "" };
            }
          });
        });
      });

      setPrice("");
      setPurchaseLink("");
      // ***
      setPicUrls([]);
    }
  };

  const handleChangeCat = (e) => {
    const value = e.target.value;
    if (value) {
      setCategory(value);
      setCategoryError("");
    } else {
      setCategory("");
      setCategoryError(errorRequired);
    }
  };

  const handleChangeName = (e) => {
    setNameError("");
    setName(e.target.value);
  };

  const handleBlurName = () => {
    const value = name.trim();
    setName(value);
    if (value) {
      setNameError("");
    } else {
      setNameError(errorRequired);
    }
  };

  const handleChangeDescription = (e) => {
    setDescriptionError("");
    setDescription(e.target.value);
  };

  const handleBlurDescription = (e) => {
    const value = description.trim();
    setDescription(value);
    if (value) {
      setDescriptionError("");
    } else {
      setDescriptionError(errorRequired);
    }
  };

  const handleChangeSpec = (e, ind, specName) => {
    let value = e.target.value;
    let valueError = "";

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
  };

  const handleChangePrice = (e) => {
    const value = e.target.value.trim();
    if (value === "" || regExpPrice.test(value)) {
      setPrice(value);
    }
    if (value === "") {
      setPriceError(errorRequired);
    } else {
      setPriceError("");
    }
  };

  const handleChangePurchaseLink = (e) => {
    setPurchaseLinkError("");
    setPurchaseLink(e.target.value);
  };

  const handleBlurPurchaseLink = (e) => {
    const value = purchaseLink.trim();
    setPurchaseLink(value);
    if (!value) {
      setPurchaseLinkError(errorRequired);
      return;
    } else if (!regExpUrl.test(value)) {
      setPurchaseLinkError("Please provide a valid URL");
    } else {
      setPurchaseLinkError("");
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
      {/* Categories */}
      <FormControl error={!!categoryError} required variant="outlined">
        <InputLabel id="cat-label">Category</InputLabel>
        <Select labelId="cat-label" id="cat-select" value={category} onChange={handleChangeCat} label="Category">
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
        onChange={handleChangeName}
        onBlur={handleBlurName}
        value={name}
        label="Product Name"
        variant="outlined"
      />
      {/* Product Description */}
      <TextField
        error={!!descriptionError}
        helperText={descriptionError}
        required
        onChange={handleChangeDescription}
        onBlur={handleBlurDescription}
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
              if (spec) {
                return spec[specName];
              }
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

          // const [specListValue] = Object.values(Object.values(specList[index]));
          // const [specListErrorValue] = Object.values(Object.values(specListError[index]));
          {
            /* Specification */
          }
          return (
            <FormControl key={specName} error={!!specListErrorValue} variant="outlined" required={false}>
              <InputLabel id={`${specName}-label`}>{specName}</InputLabel>
              <Select
                labelId={specName}
                id={specName}
                value={specListValue}
                onChange={(e) => handleChangeSpec(e, index, specName)}
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
      <FormControl error={!!priceError} required variant="outlined">
        <InputLabel htmlFor="price">Price</InputLabel>
        <OutlinedInput
          variant="outlined"
          id="price"
          value={price}
          onChange={handleChangePrice}
          startAdornment={<InputAdornment position="start">£</InputAdornment>}
          labelWidth={50}
        />
        {priceError && <FormHelperText>{priceError}</FormHelperText>}
      </FormControl>
      {/* Purchase Link */}
      <TextField
        error={!!purchaseLinkError}
        helperText={purchaseLinkError}
        required
        onChange={handleChangePurchaseLink}
        onBlur={handleBlurPurchaseLink}
        value={purchaseLink}
        label="Purchase Link"
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

export default ProductForm;
