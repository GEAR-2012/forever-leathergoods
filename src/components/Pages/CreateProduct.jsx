import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import ProductForm from "../FormUtilities/ProductForm";
import useCreateDoc from "../../hooks/use-create-doc";

const CreateProduct = () => {
  const navigate = useNavigate();
  // this state holds the product datas
  const initUploadData = {
    category: "",
    name: "",
    description: "",
    specifications: [],
    price: "",
    purchaseLink: "",
    pictureList: [],
  };
  const [productToCreate, setProductToCreate] = useState(initUploadData);
  const [product, setProduct] = useState();

  // create a new product & redirect to add pictures to it
  useCreateDoc("products", product).then((docId) => {
    if (docId) navigate(`/updateproduct/${docId}`);
  });

  const createProductHandler = () => {
    setProduct(productToCreate); // trigger 'useCreateDoc'
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          Create a new Product
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <ProductForm
          inputData={productToCreate}
          setInputData={setProductToCreate}
          buttonText="create product"
          onSubmit={createProductHandler}
        />
      </Grid>
    </Grid>
  );
};

export default CreateProduct;
