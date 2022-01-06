import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import useStorage from "../../hooks/useStorage";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const ProgressBar = ({ addPicture, setAddPicture }) => {
  const classes = useStyles();

  const { setPicUrls } = AppState();

  const { url, progress, name } = useStorage(addPicture);

  useEffect(() => {
    if (url) {
      const title = name;
      setPicUrls((prevState) => {
        const data = { url, title };
        return [...prevState, data];
      });
      setAddPicture(null);
    }
  }, [url, progress, name]);

  return (
    <div className={classes.root}>
      <LinearProgress color="secondary" variant="determinate" value={progress} />
    </div>
  );
};

export default ProgressBar;
