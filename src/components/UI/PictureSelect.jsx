import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import useUploadPictures from "../../hooks/use-upload-pictures";
import { cutFileExtension } from "../../functions/functions";
import { AppState } from "../../context/app-context";

const Input = styled("input")({
  display: "none",
});

const PictureSelect = ({ folderName, docId }) => {
  const { progress } = AppState();

  const [selectedFiles, setSelectedFiles] = useState();

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setSelectedFiles(null);
      }, 1000);
    }
  }, [progress]);

  useUploadPictures(folderName, selectedFiles, docId);

  const inputChangeHandler = (e) => {
    const files = e.target.files;

    if (files) {
      // if one or more picture seleced
      // making a modified file array
      const fileArr = [];
      Object.values(files).forEach((file) => {
        // making unique filename
        // this way user can upload the same images multiple times
        const newFileName = cutFileExtension(file.name) + "___" + uuidv4();

        // object wich will hold unique file name & the file itself
        const fileObj = { name: newFileName, file };
        fileArr.push(fileObj);
      });

      setSelectedFiles(fileArr); // it is trigger the 'useUploadPictures' hook
    }
  };

  return (
    <label htmlFor="icon-button-file">
      <Input onChange={inputChangeHandler} accept="image/jpeg, image/png" id="icon-button-file" type="file" multiple />
      <IconButton color="primary" aria-label="upload picture" component="span">
        <PhotoCamera />
      </IconButton>
    </label>
  );
};

export default PictureSelect;
