import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { AppState } from "../../context/app-context";
import PictureCard from "../UI/PictureCard";
import ProgressCircle from "../UI/ProgressCircle";
import useGetProductsList from "../../hooks/useGetProductsList";
import useDeleteDocument from "../../hooks/useDeleteDocument";
import { storage } from "../../firebase/config";
import { deleteObject, ref } from "firebase/storage";

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
  const { isAdmin, setAlert, confirm, setConfirm } = AppState();

  const [productToDelete, setProductToDelete] = useState();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);

  const getProducts = useGetProductsList(catname);

  // delete a product
  const [docId, setDocId] = useState("");

  useDeleteDocument("products", docId);

  const deleteFileFromStorage = (item) => {
    // references
    const fileRef = ref(storage, item.title);

    if (fileRef.name) {
      // delete the file
      deleteObject(fileRef)
        .then()
        .catch((error) => {
          setAlert({
            open: true,
            message: error,
            type: "error",
          });
        });
    }
  };

  // effect to delete a product
  useEffect(() => {
    if (confirm.response && productToDelete) {
      // trigger to delete product from firestore
      setDocId(productToDelete.id);
      // delete product pictures from storage
      const pictures = productToDelete.pictureList;
      if (pictures.length > 0) {
        pictures.forEach((picture) => {
          deleteFileFromStorage(picture);
        });
      }
    }
  }, [confirm.response, productToDelete]);

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
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
          <Button onClick={() => navigate("/produpload")} variant="contained" color="primary">
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
          <Typography variant="h6">There is no products in category '{catname}'.</Typography>
        </Grid>
      )}
      {products &&
        products.map((product) => {
          const prodId = product.id;
          const prodName = product.name;

          return (
            <Grid key={prodId} item xs={12} sm={6} md={4} lg={3}>
              <PictureCard
                id={prodId}
                title={prodName}
                imageUrl={product.pictureList[0].url}
                onClick={() => navigate(`/product/${prodId}`)}
                onDelete={() => handleDeleteProduct(product)}
                onEdit={() => navigate(`/produpdate/${prodId}`)}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};

export default Listing;
