import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";
import PictureCard from "../UI/PictureCard";
import ProgressCircle from "../UI/ProgressCircle";
import useListenToProductCategory from "../../hooks/use-listen-to-product-category";
import useDeleteDocWithPics from "../../hooks/use-delete-doc-with-pics";
import sortByFileName from "../../functions/sortByFileName";
import { AppState } from "../../context/app-context";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  title: {
    textTransform: "capitalize",
  },
  catBtn: {
    textAlign: "left",
    [theme.breakpoints.up("md")]: {
      textAlign: "right",
    },
  },
  icon: {},
}));

const Listing = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { catname } = useParams();
  const { isAdmin, confirm, setConfirm, placeholderImgUrl } = AppState();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);

  const getProducts = useListenToProductCategory(catname);

  // delete a product
  const [preSelectProdIdToDelete, setPreSelectProdIdToDelete] = useState();
  const [docIdToDelete, setDocIdToDelete] = useState();

  useDeleteDocWithPics("products", docIdToDelete);

  // effect to set a produc to delete
  useEffect(() => {
    if (confirm.response && preSelectProdIdToDelete) {
      // trigger to delete product from firestore
      setDocIdToDelete(preSelectProdIdToDelete);
    }
  }, [confirm.response, preSelectProdIdToDelete]);

  const handleDeleteProduct = (product) => {
    setPreSelectProdIdToDelete(product.id);
    setConfirm({
      open: true,
      message: `Are you sure you want to delete the product "${product.name.toUpperCase()}"?`,
      response: false,
    });
  };

  useEffect(() => {
    setLoading(true);
    if (getProducts) {
      if (getProducts.length === 0) {
        setProducts(null);
      } else {
        setProducts(getProducts);
      }
      setLoading(false);
    }
  }, [getProducts]);

  return (
    <Grid className={classes.root} container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography className={classes.title} variant="h3">
          {catname}
        </Typography>
      </Grid>
      <Grid className={classes.catBtn} item xs={12} md={6}>
        {isAdmin && (
          <Button onClick={() => navigate("/createproduct")} variant="contained" color="primary">
            Create New Product
          </Button>
        )}
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <ProgressCircle />
        </Grid>
      )}
      {!products && !loading && (
        <Grid item xs={12}>
          <Typography variant="h6">There is no product yet in category '{catname}'.</Typography>
        </Grid>
      )}
      {products &&
        products.map((product) => {
          const prodId = product.id;
          const prodName = product.name;
          let mainPicUrl = placeholderImgUrl;
          if (product.pictureList.length > 0) {
            mainPicUrl = sortByFileName(product.pictureList)[0].url;
          }

          return (
            <Grid key={prodId} item xs={12} sm={6} md={4} lg={3}>
              <PictureCard
                id={prodId}
                title={prodName}
                imageUrl={mainPicUrl}
                onClick={() => navigate(`/product/${prodId}`)}
                onDelete={() => handleDeleteProduct(product)}
                onEdit={() => navigate(`/updateproduct/${prodId}`)}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};

export default Listing;
