import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import ProductForm from "../FormUtilities/ProductForm";
import PreviewImageList from "../FormUtilities/PreviewImageList";
import { useParams } from "react-router-dom";
import useUpdateDocument from "../../hooks/useUpdateDocument";
import useGetProduct from "../../hooks/useGetProduct";

const UpdateProduct = () => {
  const { productid } = useParams();
  const product = useGetProduct(productid);
  const [category, setCategory] = useState("");

  // get the category if product is available
  useEffect(() => {
    if (product) {
      setCategory(product.category);
    }
  }, [product]);

  // product update
  const [productUpdate, setProductUpdate] = useState(null);

  useUpdateDocument("products", productUpdate?.id, productUpdate?.doc, `/listing/${category}`);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Product Update
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <ProductForm product={product} setProduct={setProductUpdate} buttonText="update the product" />
      </Grid>

      <Grid item xs={12} md={6}>
        <PreviewImageList />
      </Grid>
    </Grid>
  );
};

export default UpdateProduct;
