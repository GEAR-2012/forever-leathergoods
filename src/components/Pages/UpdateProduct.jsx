import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import ProductForm from "../FormUtilities/ProductForm";
import PictureSelect from "../UI/PictureSelect";
import ProgressLinear from "../UI/ProgressLinear";
import MasonryImageGrid from "../UI/MasonryImageGrid";
import useUpdateDoc from "../../hooks/use-update-doc";
import useDeletePicture from "../../hooks/use-delete-picture";
import useListenToDoc from "../../hooks/use-listen-to-doc";
import sortByFileName from "../../functions/sortByFileName";
import { AppState } from "../../context/app-context";

const UpdateProduct = () => {
  const { prod_id } = useParams();
  const navigate = useNavigate();

  const { progress } = AppState();

  const productGet = useListenToDoc("products", prod_id);

  const [productToUpdate, setProductToUpdate] = useState("");

  const [product, setProduct] = useState(null);
  const [picToDelete, setPicToDelete] = useState();

  // update product & redirect to home page
  useUpdateDoc("products", prod_id, product).then((resp) => {
    if (resp) navigate("/");
  });

  // custom hook to delete one picture
  useDeletePicture("products", prod_id, picToDelete);

  const deleteProductPictureHandler = (pic) => {
    setPicToDelete(pic);
  };

  const updateProductHandler = () => {
    setProduct(productToUpdate); // trigger 'useUpdateDoc'
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Update Product
        </Typography>
      </Grid>

      {productGet && (
        <Grid item xs={12} md={6}>
          <ProductForm
            productGet={productGet}
            setInputData={setProductToUpdate}
            buttonText="update the product"
            onSubmit={updateProductHandler}
          />
        </Grid>
      )}

      {productGet && (
        <Grid item xs={12} md={6}>
          <PictureSelect folderName="products" docId={prod_id} />
          {/* Linear progress bar */}
          {progress !== 0 && <ProgressLinear progress={progress} />}
          {/* Image grid */}
          <MasonryImageGrid itemData={sortByFileName(productGet.pictureList)} onDelete={deleteProductPictureHandler} />
        </Grid>
      )}
    </Grid>
  );
};

export default UpdateProduct;
