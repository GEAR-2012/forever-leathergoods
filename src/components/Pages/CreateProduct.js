import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import ProductForm from "../FormUtilities/ProductForm";
import PreviewImageList from "../FormUtilities/PreviewImageList";
import useCreateDocument from "../../hooks/useCreateDocument";

const CreateProduct = () => {
  // product upload
  const [productUpload, setProductUpload] = useState(null);
  useCreateDocument("products", productUpload);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Product Upload
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <ProductForm setProduct={setProductUpload} buttonText="add new product" />
      </Grid>

      <Grid item xs={12} md={6}>
        <PreviewImageList />
      </Grid>
    </Grid>
  );
};

export default CreateProduct;
