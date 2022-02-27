import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography, IconButton, Card, CardActionArea, CardMedia, CardActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    minHeight: 200,
  },
  cardActions: {
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
  },
  title: {
    textTransform: "uppercase",
    flexGrow: 1,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

const PictureCard = ({ id, title, imageUrl, onClick, onDelete, onEdit }) => {
  const classes = useStyles();
  const { isAdmin } = AppState();

  return (
    <Card id={id} className={classes.root}>
      <CardActionArea onClick={onClick}>
        <CardMedia className={classes.media} image={imageUrl} title={title} />
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Typography noWrap className={classes.title} variant="subtitle1" component="h2">
          {title}
        </Typography>
        {isAdmin && (
          <>
            <IconButton color="primary" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default PictureCard;
