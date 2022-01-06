import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { CardActions, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
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
