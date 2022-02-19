import React, { useState, useEffect } from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { AppState } from "../../context/app-context";
import { db, timestamp } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const errorRequired = "This field is required";

const SpecForm = ({
  isFormSubmitted,
  setIsFormSubmitted,
  selectedSpec,
  setSelectedSpec,
  setPreSelectToCreate,
  setPreSelectToUpdate,
  buttonText,
  setButtonText,
}) => {
  const classes = useStyles();
  const { setAlert, setConfirm } = AppState();

  // Input values & errors
  const [specIndex, setSpecIndex] = useState("");
  const [specIndexDisabled, setSpecIndexDisabled] = useState(false);
  const [specIndexError, setSpecIndexError] = useState("");
  //
  const [specName, setSpecName] = useState("");
  const [specNameError, setSpecNameError] = useState("");
  //
  const [specValues, setSpecValues] = useState("");
  const [specValuesError, setSpecValuesError] = useState("");
  //
  const [isFormValid, setIsFormValid] = useState(false);

  // FUNCTIONS
  const handleReset = useCallback(() => {
    console.log("handle reset init");
    // Reset selected Spec
    setSelectedSpec(undefined);
    // Reset button text
    setButtonText("create new spec");
    // Reset fields
    setSpecIndex("");
    setSpecName("");
    setSpecValues("");
    setButtonText("create new spec");
  }, [setSelectedSpec, setButtonText]);

  // set form validity, check for any input error
  useEffect(() => {
    if (!specIndexError && !specNameError && !specValuesError && specIndex && specName && specValues) {
      // if no any error set the form valid
      setIsFormValid(true);
    } else {
      // if any error set the form invalid
      setIsFormValid(false);
    }
  }, [specIndexError, specNameError, specValuesError, specIndex, specName, specValues]);

  // fill the form if user select a spec from the list
  useEffect(() => {
    if (selectedSpec) {
      // reset errors
      setSpecIndexError("");
      setSpecNameError("");
      setSpecValuesError("");

      let specIndex = 0;
      let specName = "";
      let specValues = [];

      for (const [key, value] of Object.entries(selectedSpec)) {
        if (key === "index") {
          specIndex = value;
        } else if (key !== "id" && key !== "createdAt" && key !== "modifiedAt") {
          specName = key;
          specValues = value;
        }
      }

      specValues = specValues.join(", ");

      setSpecIndex(specIndex);
      setSpecIndexDisabled(true);
      setSpecName(specName);
      setSpecValues(specValues);
    } else {
      // reset local states
      setSpecIndex("");
      setSpecIndexDisabled(false);
      setSpecName("");
      setSpecValues("");
    }
  }, [selectedSpec]);

  // if the form is submitted
  useEffect(() => {
    if (isFormSubmitted) {
      handleReset();
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted, handleReset, setIsFormSubmitted]);

  const handleCreateSpec = () => {
    // setting the spec object to upload
    const specValuesArr = comaSepStringToArray(specValues);
    setPreSelectToCreate({
      index: specIndex,
      [specName]: specValuesArr,
      createdAt: timestamp,
    });
  };

  const handleUpdateSpec = (specId, specIndex) => {
    // setting the spec object to update
    const specValuesArr = comaSepStringToArray(specValues);

    setPreSelectToUpdate({
      id: specId,
      doc: {
        index: specIndex,
        [specName]: specValuesArr,
        modifiedAt: timestamp,
      },
    });
    setConfirm({
      open: true,
      message: `Are you sure you want to overwrite spec with index of ${specIndex}`,
      response: false,
    });
  };

  // check for a specification in the database with a given index
  // if already in the db return true else (or any error) return false
  const isSpecIndexExists = async (specIndex) => {
    let result = false;

    try {
      const collectionRef = collection(db, "specifications");
      const q = query(collectionRef, where("index", "==", specIndex));

      const querySnapshot = await getDocs(q);

      const queryResult = [];

      querySnapshot.forEach((doc) => {
        queryResult.push(doc.id);
      });

      if (queryResult.length > 0) {
        result = true;
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error,
        type: "error",
      });
    }
    return result;
  };

  const comaSepStringToArray = (str) => {
    let arr = str.split(",");
    // clean each item
    arr = arr.map((item) => item.trim());
    // convert string input items
    arr = arr.map((item) => {
      if (item === "true") {
        return true;
      } else if (item === "false") {
        return false;
      } else if (isNaN(item)) {
        return item;
      } else if (!isNaN(item)) {
        return Number(item);
      } else {
        return item;
      }
    });

    return arr;
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      setAlert({
        open: true,
        message: "Form not valid yet",
        type: "warning",
      });
      return;
    }

    // check for mode
    if (selectedSpec) {
      console.log("UPDATE MODE");
      // update mode
      // set to UPDATE
      handleUpdateSpec(selectedSpec.id, specIndex);
    } else {
      console.log("CREATE MODE");

      // create mode
      // check if doc with this index exists
      // if so alert if not upload
      isSpecIndexExists(specIndex)
        .then((resp) => {
          if (resp) {
            setAlert({
              open: true,
              message: `Specification with index of ${specIndex} already in the database.`,
              type: "warning",
            });
          } else {
            // set to CREATE
            handleCreateSpec();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // change & blur handlers

  const handleChangeIndex = (e) => {
    setSpecIndexError("");
    setSpecIndex(e.target.value);
  };

  const handleBlurIndex = () => {
    const value = specIndex;
    if (value === "") {
      setSpecIndexError(errorRequired);
      return;
    }
    if (isNaN(value)) {
      setSpecIndexError("Index should be an integer");
      return;
    }
    setSpecIndex(Math.floor(Number(value)));
  };

  const handleChangeSpecName = (e) => {
    setSpecNameError("");
    setSpecName(e.target.value);
  };

  const handleBlurSpecName = () => {
    const value = specName.trim();
    setSpecName(value);
    if (value) {
      setSpecNameError("");
    } else {
      setSpecNameError(errorRequired);
    }
  };

  const handleChangeSpecValues = (e) => {
    setSpecValuesError("");
    setSpecValues(e.target.value);
  };

  const handleBlurSpecValues = () => {
    const value = specValues.trim();
    setSpecValues(value);
    if (value) {
      setSpecValuesError("");
    } else {
      setSpecValuesError(errorRequired);
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      {/* Index */}
      <TextField
        error={!!specIndexError}
        helperText={specIndexError}
        required
        onChange={handleChangeIndex}
        onBlur={handleBlurIndex}
        value={specIndex}
        label="Spec Index"
        variant="outlined"
        disabled={specIndexDisabled}
        color="primary"
      />
      {/* Spec Name */}
      <TextField
        error={!!specNameError}
        helperText={specNameError}
        required
        onChange={handleChangeSpecName}
        onBlur={handleBlurSpecName}
        value={specName}
        label="Spec Name"
        variant="outlined"
        color="primary"
      />
      {/* Spec Values */}
      <TextField
        error={!!specValuesError}
        helperText={specValuesError}
        required
        onChange={handleChangeSpecValues}
        onBlur={handleBlurSpecValues}
        value={specValues}
        label="Spec Values"
        variant="outlined"
        color="primary"
      />

      {/* Submit button */}
      <Button onClick={handleSubmit} type="button" variant="contained" color="primary">
        {buttonText}
      </Button>
      {/* Reset button */}
      <Button fullWidth onClick={handleReset} type="button" variant="contained" color="secondary">
        Reset Input Fields
      </Button>
    </form>
  );
};

export default SpecForm;
