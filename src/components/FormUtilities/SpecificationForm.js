import React, { useState, useEffect } from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { AppState } from "../../context/app-context";
import { db, timestamp } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const SpecificationForm = ({
  selectedSpecification,
  setSelectedSpecification,
  setSpecification,
  setSpecificationToUpdate,
  buttonText,
  setButtonText,
}) => {
  // Input values & errors
  const [index, setIndex] = useState("");
  const [indexError, setIndexError] = useState("");
  //
  const [specificationName, setSpecificationName] = useState("");
  const [specificationNameError, setSpecificationNameError] = useState("");
  //
  const [specificationValues, setSpecificationValues] = useState("");
  const [specificationValuesError, setSpecificationValuesError] = useState("");
  //

  // this is for identify doc by selection
  const [docId, setDocId] = useState("");

  const { setAlert, confirm, setConfirm } = AppState();

  // set the fields if the form used for update a product
  useEffect(() => {
    if (selectedSpecification) {
      setDocId(selectedSpecification.id);

      let specIndex = 0;
      let specName = "";
      let values = [];

      for (const [key, value] of Object.entries(selectedSpecification)) {
        if (key === "index") {
          specIndex = value;
        } else if (key !== "id" && key !== "createdAt" && key !== "modifiedAt") {
          specName = key;
          values = value;
        }
      }
      const specValues = values.join(", ");

      setIndex(specIndex);
      setSpecificationName(specName);
      setSpecificationValues(specValues);
    } else {
      // reset id & fields
      setDocId("");
      setIndex("");
      setSpecificationName("");
      setSpecificationValues("");
      setConfirm({
        open: false,
        message: "",
        response: false,
      });
    }
  }, [selectedSpecification]);

  const classes = useStyles();

  const errorRequired = "This field is required";

  useEffect(() => {
    if (confirm.response) {
      console.log("Overwrite");
    }
  }, [confirm.response]);

  const handleSubmit = () => {
    // check if any field is empty
    if (!index) {
      setIndexError(errorRequired);
      return;
    }

    if (!specificationName) {
      setSpecificationNameError(errorRequired);
      return;
    }

    if (!specificationValues) {
      setSpecificationValuesError(errorRequired);
      return;
    }

    // check if doc with this index exists
    const writeData = async (index, specificationName, values) => {
      try {
        const collectionRef = collection(db, "specifications");
        const q = query(collectionRef, where("index", "==", index));

        const querySnapshot = await getDocs(q);

        const queryResult = [];

        querySnapshot.forEach((doc) => {
          queryResult.push({ id: doc.id, doc: doc.data() });
        });

        const id = queryResult[0]?.id;
        if (id) {
          //   // update existing
          setSpecificationToUpdate({
            id,
            doc: {
              index,
              [specificationName]: values,
              modifiedAt: timestamp,
            },
          });
        } else if (docId) {
          //   // update existing by selection (overwrite index)
          setSpecificationToUpdate({
            id: docId,
            doc: {
              index,
              [specificationName]: values,
              modifiedAt: timestamp,
            },
          });
        } else {
          // create new
          setSpecification({
            index,
            [specificationName]: values,
            createdAt: timestamp,
          });
        }
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }

      // reset states
      setSpecificationToUpdate(undefined);
      setDocId("");
    };

    // check for all required values
    if (specificationName && specificationValues && index) {
      // setting the specification object to upload / update
      let values = specificationValues.split(",");
      values = values.map((value) => value.trim());
      values = values.map((value) => {
        if (value === "true") {
          return true;
        } else if (value === "false") {
          return false;
        } else if (isNaN(value)) {
          return value;
        } else if (!isNaN(value)) {
          return Number(value);
        }
      });

      // check if doc with this index exists
      // if so overwrite if not upload
      writeData(index, specificationName, values);

      // Reset fields
      setIndex("");
      setSpecificationName("");
      setSpecificationValues("");
      // Reset button text
      setButtonText("create new specification");

      // Reset selected Specification if already set
      if (selectedSpecification) {
        setSelectedSpecification(undefined);
      }
    }
  };

  const handleChangeIndex = (e) => {
    setIndexError("");
    setIndex(e.target.value);
  };

  const handleBlurIndex = () => {
    const value = index.trim();
    setIndex(value);
    if (value) {
      setIndexError("");
    } else {
      setIndexError(errorRequired);
    }

    if (isNaN(value)) {
      setIndexError("Index should be an integer");
    } else {
      setIndex(Math.floor(Number(value)));
    }
  };

  const handleChangeSpecName = (e) => {
    setSpecificationNameError("");
    setSpecificationName(e.target.value);
  };

  const handleBlurSpecName = () => {
    const value = specificationName.trim();
    setSpecificationName(value);
    if (value) {
      setSpecificationNameError("");
    } else {
      setSpecificationNameError(errorRequired);
    }
  };

  const handleChangeSpecValues = (e) => {
    setSpecificationValuesError("");
    setSpecificationValues(e.target.value);
  };

  const handleBlurSpecValues = () => {
    const value = specificationValues.trim();
    setSpecificationValues(value);
    if (value) {
      setSpecificationValuesError("");
    } else {
      setSpecificationValuesError(errorRequired);
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      {/* Index */}
      <TextField
        error={!!indexError}
        helperText={indexError}
        required
        onChange={handleChangeIndex}
        onBlur={handleBlurIndex}
        value={index}
        label="Index"
        variant="outlined"
      />
      {/* Specification Name */}
      <TextField
        error={!!specificationNameError}
        helperText={specificationNameError}
        required
        onChange={handleChangeSpecName}
        onBlur={handleBlurSpecName}
        value={specificationName}
        label="Specification Name"
        variant="outlined"
      />
      {/* Specification Values */}
      <TextField
        error={!!specificationValuesError}
        helperText={specificationValuesError}
        required
        onChange={handleChangeSpecValues}
        onBlur={handleBlurSpecValues}
        value={specificationValues}
        label="Specification Values"
        variant="outlined"
      />

      {/* Submit button */}
      <Button onClick={handleSubmit} type="button" variant="contained" color="primary">
        {buttonText}
      </Button>
    </form>
  );
};

export default SpecificationForm;
