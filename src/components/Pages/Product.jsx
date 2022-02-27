import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Grid, Typography, Button, ButtonGroup, List, ListItem } from "@mui/material";
import ProgressCircle from "../UI/ProgressCircle";
import MyCarousel from "../UI/MyCarousel";
import useGetDoc from "../../hooks/use-get-doc";
import useDeleteDocWithPics from "../../hooks/use-delete-doc-with-pics";
import sortByFileName from "../../functions/sortByFileName";
import { AppState } from "../../context/app-context";

const formatter = new Intl.NumberFormat("en-UK", {
  style: "currency",
  currency: "GBP",
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const useStyles = makeStyles((theme) => ({
  titleBar: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    alignContent: "flex-start",
  },
  descriptionBody: {
    paddingLeft: theme.spacing(2),
  },
  actionButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  actionButtonGroup: {
    display: "flex",
    gap: theme.spacing(1),
  },
  specListItemTitle: {
    fontWeight: "600",
  },
  specListItem: {},
  specListItemData: {
    paddingLeft: theme.spacing(2),
  },

  linkButtonContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  linkButtonLabel: {
    fontSize: "1.2rem",
    letterSpacing: "0.05rem",
    wordSpacing: "0.2rem",
  },
  linkButtonFullWidth: {
    width: "fit-content",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const Product = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { prod_id } = useParams();

  const { setImageModal, isVertical, isAdmin, confirm, setConfirm } = AppState();

  // new stuff
  const [prodIdToDelete, setProdIdToDelete] = useState();

  useDeleteDocWithPics("products", prodIdToDelete).then((resp) => {
    if (resp) navigate("/");
  });

  // clean up...
  useEffect(() => {
    return () => {
      // reset confirm modal
      setConfirm({
        open: false,
        message: "",
        response: false,
      });
    };
  }, [setConfirm]);

  // end of new stuff

  const [pictures, setPictures] = useState(); // product pictures

  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true); // while get the product data

  const getProduct = useGetDoc("products", prod_id);

  // set up the 'product' & 'pictures' states
  useEffect(() => {
    if (getProduct) {
      setProduct(getProduct);
      if (getProduct.hasOwnProperty("pictureList")) {
        if (getProduct.pictureList.length > 0) {
          setPictures(sortByFileName(getProduct.pictureList));
        }
      }
    }
  }, [getProduct]);

  // effect to set a product to be deleted
  useEffect(() => {
    if (confirm.response) {
      setProdIdToDelete(prod_id); // it's trigger the 'useDeleteDocWithPics' custom hook
    }
  }, [confirm.response, prod_id]);

  // effect to control the loading state
  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  const handleDeleteProduct = () => {
    setConfirm({
      open: true,
      message: `Are you sure you want to delete the product "${product.name.toUpperCase()}"?`,
      response: false,
    });
  };

  const imageClickHandler = (i) => {
    setImageModal({
      open: true,
      pictures,
      index: i,
    });
  };

  // CONTENTS **********
  // loading
  let contentLoading = "";
  if (loading) {
    contentLoading = (
      <Grid item xs={12}>
        <ProgressCircle />
      </Grid>
    );
  }

  // no product message
  let contentNoProduct = "";
  if (!loading && !product) {
    contentNoProduct = (
      <Grid item xs={12}>
        <Typography variant="h6">This porduct does not exists.</Typography>
      </Grid>
    );
  }

  // Picture Carousel
  let contentPictureCarousel = "";
  if (pictures) {
    contentPictureCarousel = (
      <Grid item xs={12}>
        <MyCarousel isVertical={isVertical} pictures={pictures} onImageClick={imageClickHandler} />
      </Grid>
    );
  }

  // Product
  let contentProduct = "";
  if (product) {
    contentProduct = (
      <>
        {/* Header */}
        <Grid className={classes.titleBar} item xs={12} container spacing={2}>
          {/* Product Title */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4">{product.name}</Typography>
          </Grid>
          {/* Actions */}
          {isAdmin && (
            <Grid className={classes.actionButtonContainer} item xs={12} md={6}>
              <ButtonGroup className={classes.actionButtonGroup}>
                <Button variant="contained" color="primary" onClick={() => navigate(`/updateproduct/${prod_id}`)}>
                  Edit Product
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleDeleteProduct()}>
                  Delete Product
                </Button>
              </ButtonGroup>
            </Grid>
          )}
        </Grid>
        {contentPictureCarousel}
        {/* Purchase link button */}
        <Grid className={classes.linkButtonContainer} item xs={12}>
          <Button
            fullWidth
            classes={{
              label: classes.linkButtonLabel,
              fullWidth: classes.linkButtonFullWidth,
            }}
            color="primary"
            variant="contained"
            size="large"
            href={product.purchaseLink}
            target="_blank"
          >
            Buy it on Etsy
          </Button>
        </Grid>

        {/* About the Product */}
        <Grid className={classes.description} item xs={12} md={6} spacing={4} container>
          {/* Price */}
          <Grid item xs={12}>
            <Typography variant="h4">{formatter.format(product.price)}</Typography>
          </Grid>
          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Description
            </Typography>
            <Typography className={classes.descriptionBody} variant="body1">
              {product.description}
            </Typography>
          </Grid>

          {/* Specifications */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Specifications
            </Typography>
            <List dense style={{ padding: 0 }}>
              {product.specifications
                .filter((spec) => {
                  let toReturn;
                  const specValue = Object.values(spec)[0];
                  if (specValue) {
                    toReturn = spec;
                  }
                  return toReturn;
                })
                .map((spec) => {
                  const specName = Object.keys(spec)[0];
                  const specValue = Object.values(spec)[0];

                  return (
                    <ListItem key={specName} className={classes.specListItem}>
                      <Typography className={classes.specListItemTitle} variant="body1">
                        {specName}:
                      </Typography>
                      <Typography className={classes.specListItemData} variant="body1">
                        {specValue}
                      </Typography>
                    </ListItem>
                  );
                })}
            </List>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <Grid className={classes.root} container spacing={2}>
      {contentLoading}
      {contentNoProduct}
      {contentProduct}
    </Grid>
  );
};

export default Product;
