import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import PictureSelect from "../UI/PictureSelect";
import ProgressLinear from "../UI/ProgressLinear";
import ProgressCircle from "../UI/ProgressCircle";
import MasonryImageGrid from "../UI/MasonryImageGrid";
import useListenToDoc from "../../hooks/use-listen-to-doc";
import useDeletePicture from "../../hooks/use-delete-picture";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({}));

const collectionName = "about";
const folderMain = "main";
const folderGallery = "gallery";

const ModifyAboutPictures = () => {
  const classes = useStyles();
  const { progress } = AppState();

  const [isLoading, setIsLoading] = useState(true);
  const [folder, setFolder] = useState(folderMain);
  const [pictureList, setPictureList] = useState(null);
  const [picToDelete, setPicToDelete] = useState(null);

  // CUSTOM HOOKS
  // hook to listen to a specific document to get about pictures to preview
  const aboutDocGet = useListenToDoc(collectionName, folder);
  // custom hook to delete one picture
  useDeletePicture(collectionName, folder, picToDelete);

  // set 'pictureList' state
  useEffect(() => {
    if (aboutDocGet) {
      if (aboutDocGet.hasOwnProperty("pictureList")) {
        if (aboutDocGet.pictureList.length > 0) {
          setPictureList(aboutDocGet.pictureList);
        } else {
          setPictureList(null);
        }
      } else {
        setPictureList(null);
      }
    }
    setIsLoading(false);
    return () => {
      setPictureList(null);
    };
  }, [aboutDocGet]);

  // change the upload folder
  const optionsChangeHandler = (e) => {
    setIsLoading(true);
    setPicToDelete(null);
    const val = e.target.value;
    if (val === folderMain) {
      setFolder(folderMain);
    } else if (val === folderGallery) {
      setFolder(folderGallery);
    }
  };

  const deletePictureHandler = (pic) => {
    setPicToDelete(pic);
  };

  return (
    <Grid container spacing={4}>
      {/* Title */}
      <Grid item xs={12}>
        <Typography variant="h3">Modify About Pictures</Typography>
      </Grid>

      {/* Divider */}
      <Grid item xs={12}>
        <Divider />
      </Grid>

      {/* Form */}
      <Grid item xs={12} md={6}>
        <form className={classes.root} noValidate autoComplete="off">
          {/* Options */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Options</FormLabel>
            <RadioGroup
              aria-label="upload options"
              name="about_options"
              defaultValue={folderMain}
              onChange={optionsChangeHandler}
            >
              <FormControlLabel value={folderMain} control={<Radio />} label="Main Pictures" />
              <FormControlLabel value={folderGallery} control={<Radio />} label="Gallery Pictures" />
            </RadioGroup>
          </FormControl>
        </form>
      </Grid>

      {/* Image Select */}
      <Grid item xs={12} md={6}>
        <PictureSelect folderName={collectionName} docId={folder} />
        {progress !== 0 && <ProgressLinear progress={progress} />}

        {/* Circular Progress */}
        {isLoading && <ProgressCircle />}

        {/* Image Preview Grid */}
        {pictureList && <MasonryImageGrid itemData={pictureList} onDelete={deletePictureHandler} />}
      </Grid>
    </Grid>
  );
};

export default ModifyAboutPictures;
