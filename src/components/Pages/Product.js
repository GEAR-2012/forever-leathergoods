import {
  Button,
  ButtonGroup,
  Grid,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppState } from "../../context/app-context";
import useGetProduct from "../../hooks/useGetProduct";
import ProgressCircle from "../UI/ProgressCircle";
import { storage } from "../../firebase/config";
import useDeleteDocument from "../../hooks/useDeleteDocument";

const useStyles = makeStyles((theme) => ({
  titleBar: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  carousel: {
    alignContent: "flex-start",
  },
  description: {
    alignContent: "flex-start",
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
  mainPictureContainer: {
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
  },
  mainPicture: {
    width: "100%",
    maxWidth: 600,
    maxHeight: 400,
  },
  thumbnailListContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  thumbnailList: {
    width: "100%",
    maxWidth: 800,
    flexWrap: "nowrap",
  },
  thumbnail: {},
  descriptionBody: {
    paddingLeft: theme.spacing(2),
  },
  specListItem: {},
  specListItemTitle: {
    fontWeight: "600",
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
  specListItemData: {
    paddingLeft: theme.spacing(2),
  },
}));

const Product = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { isAdmin, setAlert, setOpenImageModal, setImageModalPictures, setImageModalIndex, confirm, setConfirm } =
    AppState();
  const [productToDelete, setProductToDelete] = useState();

  const [picIndex, setPicIndex] = useState(0);
  const [pictures, setPictures] = useState([]);

  const [product, setProduct] = useState();
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(true);
  const { productid } = useParams();
  const getProduct = useGetProduct(productid);

  // set up product
  useEffect(() => {
    setLoading(true);
    if (getProduct) {
      setProduct(getProduct);
      setPictures(getProduct.pictureList);
    } else {
      setProduct(null);
    }
  }, [getProduct]);

  // convert price to currency
  useEffect(() => {
    if (product) {
      setLoading(false);
      const formatter = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      setPrice(formatter.format(product.price));
    }
  }, [product]);

  // delete a product
  const [docId, setDocId] = useState("");

  useDeleteDocument("products", docId);

  // delete only one item from firebase storage
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
      // clear the product state
      setProduct(undefined);
      // delete product pictures from storage
      const pictures = productToDelete.pictureList;
      if (pictures.length > 0) {
        pictures.forEach((picture) => {
          deleteFileFromStorage(picture);
        });
      }
    }
  }, [confirm.response, productToDelete]);

  // delete an entyre product
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setConfirm({
      open: true,
      message: `Are you sure you want to delete the product "${product.name.toUpperCase()}"?`,
      response: false,
    });
  };

  const handleOpenImageModal = () => {
    setOpenImageModal(true);
    setImageModalPictures(pictures);
    setImageModalIndex(picIndex);
  };

  const changeMainPicture = (index) => {
    setPicIndex(index);
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      {loading && (
        <Grid item xs={12}>
          <ProgressCircle />
        </Grid>
      )}
      {!product && !loading && (
        <Grid item xs={12}>
          <Typography variant="h6">This porduct does not exists.</Typography>
        </Grid>
      )}

      {product && (
        <>
          {/* Product Title */}
          <Grid className={classes.titleBar} item xs={12} container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5">{product.name}</Typography>
            </Grid>
            {isAdmin && (
              <Grid className={classes.actionButtonContainer} item xs={12} md={6}>
                <ButtonGroup className={classes.actionButtonGroup}>
                  <Button variant="contained" color="primary" onClick={() => navigate(`/produpdate/${productid}`)}>
                    Edit Product
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleDeleteProduct(product)}>
                    Delete Product
                  </Button>
                </ButtonGroup>
              </Grid>
            )}
          </Grid>

          {/* Picture Carousel */}
          <Grid className={classes.carousel} item xs={12} md={6} spacing={2} container>
            <Grid className={classes.mainPictureContainer} item xs={12}>
              <Button onClick={handleOpenImageModal}>
                <img className={classes.mainPicture} src={pictures[picIndex].url} alt={product.name} />
              </Button>
            </Grid>

            <Grid className={classes.thumbnailListContainer} item xs={12}>
              <ImageList rowHeight={100} gap={10} cols={4} className={classes.thumbnailList}>
                {product.pictureList.map((pic, index) => (
                  <ImageListItem onClick={() => changeMainPicture(index)} key={pic.title}>
                    <img className={classes.thumbnail} src={pic.url} alt={pic.title} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
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
          </Grid>
          {/* Product Description */}
          <Grid className={classes.description} item xs={12} md={6} spacing={4} container>
            <Grid item xs={12}>
              <Typography variant="h4">{price}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Description
              </Typography>
              <Typography className={classes.descriptionBody} variant="body1">
                {product.description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Specifications
              </Typography>
              <List dense style={{ padding: 0 }}>
                {product.specifications
                  .filter((spec) => {
                    const specValue = Object.values(spec)[0];
                    if (specValue) {
                      return spec;
                    }
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
      )}
    </Grid>
  );
};

export default Product;
