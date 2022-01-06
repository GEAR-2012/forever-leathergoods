import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { AppState } from "../../context/app-context";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ProgressBar from "../UI/ProgressBar";
import { timestamp } from "../../firebase/config";
import useGetAbout from "../../hooks/useGetAbout";
import useAboutPictures from "../../hooks/useAboutPictures";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
}));

const pathMain = "aboutMainPicture/main";
const pathGallery = "aboutGalleryPictures/gallery";

const AboutPicturesForm = () => {
  const classes = useStyles();
  const { picUrls, setPicUrls, storageFolder, setStorageFolder } = AppState();

  console.log("storageFolder: ", storageFolder);

  // reset picture url array in app-context
  useEffect(() => {
    const cleanup = () => {
      setPicUrls([]);
    };
    return cleanup;
  }, []);

  const [isUploaded, setIsUploaded] = useState(false);

  // Input values & errors
  const [options, setOptions] = useState(pathMain);
  const [optionsError, setOptionsError] = useState("");
  // picture
  const [addPicture, setAddPicture] = useState(null);
  const [addPictureError, setAddPictureError] = useState("");

  const errorRequired = "This field is required";

  const [picturesToUpload, setPicturesToUpload] = useState();
  useAboutPictures(options, picturesToUpload);
  console.log("isUploaded: ", isUploaded);
  // Reset
  useEffect(() => {
    console.log("reset in about pictures form");
    if (isUploaded) {
      setPicturesToUpload(undefined);
      setPicUrls([]);
      setIsUploaded(false);
    }
  }, [isUploaded]);

  const aboutDoc = useGetAbout(options);

  // set the pictures if they already exist
  useEffect(() => {
    if (aboutDoc) {
      setPicUrls(aboutDoc.pictureList);
    } else {
      setPicUrls([]);
    }
  }, [aboutDoc, setPicUrls]);

  useEffect(() => {
    const folder = options.split("/")[0];
    console.log("storage folder: ", folder);
    setStorageFolder(folder); // the folder for pictures in firebase storage
  }, [options]);

  const handleSubmit = () => {
    // check if any field is empty
    if (!options) {
      setOptionsError(errorRequired);
      return;
    }

    if (picUrls.length === 0) {
      setAddPictureError("One or more picture is required");
      return;
    }

    // set document to save into firebase firestore
    setPicturesToUpload({
      pictureList: picUrls,
      createdAt: timestamp,
    });

    setIsUploaded(true);
  };

  const handleChangeOptions = (e) => {
    setOptionsError("");
    setOptions(e.target.value);
  };

  const handleBlurOptions = () => {
    const value = options.trim();
    setOptions(value);

    if (value) {
      setOptionsError("");
    } else {
      setOptionsError(errorRequired);
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
      {/* Options */}
      <FormControl error={!!optionsError} component="fieldset">
        <FormLabel component="legend">Options</FormLabel>
        <RadioGroup
          aria-label="options"
          name="options1"
          value={options}
          onChange={handleChangeOptions}
          onBlur={handleBlurOptions}
        >
          <FormControlLabel value={pathMain} control={<Radio />} label="Main Picture" />
          <FormControlLabel value={pathGallery} control={<Radio />} label="Gallery Pictures" />
        </RadioGroup>
      </FormControl>
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
        add / update picture(s)
      </Button>
    </form>
  );
};

export default AboutPicturesForm;
