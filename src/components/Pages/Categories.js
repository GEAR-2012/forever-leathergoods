import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Divider, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { AppState } from "../../context/app-context";
import PictureCard from "../UI/PictureCard";
import ProgressCircle from "../UI/ProgressCircle";
import useFirestore from "../../hooks/useFirestore";
import useDeleteDocument from "../../hooks/useDeleteDocument";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase/config";
import { useCallback } from "react";

const useStyles = makeStyles((theme) => ({
  gridRoot: {
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  catBtn: {
    textAlign: "left",
    [theme.breakpoints.up("md")]: {
      textAlign: "right",
    },
  },
  badgeRoot: {
    width: "100%",
  },
  badgeBadge: {
    backgroundColor: theme.palette.badge.main,
    color: "#fff",
    transform: "scale(1.4) translate(30%, -30%)",
    boxShadow: "0 0 0.4rem 0.1rem rgba(0, 0, 0, 0.1)",
  },
}));

const Categories = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { categories: getCategories } = useFirestore();

  const { setAlert, isAdmin, confirm, setConfirm } = AppState();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState();
  const [categoryCount, setCategoryCount] = useState([]);

  // get Caregories
  useEffect(() => {
    setLoading(true);
    if (getCategories) {
      if (getCategories.length === 0) {
        setCategories(undefined);
      } else {
        // try to get category lengths
        getCategories.forEach(async (cat) => {
          const catName = cat.categoryName;
          const collRef = collection(db, "products");
          const q = query(collRef, where("category", "==", catName));

          const querySnap = await getDocs(q);
          const prodsInCat = [];
          querySnap.forEach((doc) => {
            prodsInCat.push(doc.id);
          });
          const catLen = prodsInCat.length;
          setCategoryCount((prevState) => [...prevState, { catName, catLen }]);
        });
        // end of try to get category lengths
        setCategories(getCategories);
      }
      setLoading(false);
    }
  }, [getCategories]);

  // states for delete a category
  const [category, setCategory] = useState();
  const [categoryId, setCategoryId] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [deleteTrigger, setDeleteTrigger] = useState(false);

  useDeleteDocument("categories", categoryId);

  // delete only one item from firebase storage
  const deleteFileFromStorage = useCallback(
    (item) => {
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
    },
    [setAlert]
  );

  // if the category deletion is justified
  useEffect(() => {
    if (confirm.response === true) {
      // trigger to delete category from firestore
      setCategoryId(category?.id);
      // delete category pictures from storage
      const pictures = category?.pictureList;
      if (pictures.length > 0) {
        pictures.forEach((picture) => {
          deleteFileFromStorage(picture);
        });
      }
    }
  }, [confirm.response, category?.id, category?.pictureList, deleteFileFromStorage]);

  // check if this category contains products
  useEffect(() => {
    const collectionRef = collection(db, "products");
    const q = query(collectionRef, where("category", "==", categoryName));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const productArray = [];
      querySnapshot.forEach((doc) => {
        productArray.push({ ...doc.data(), id: doc.id });
      });
      if (categoryName) {
        if (productArray.length <= 0) {
          // if empty
          setConfirm({
            open: true,
            message: `Are You sure you want to delete the category "${categoryName.toUpperCase()}"?`,
            response: false,
          });
        } else {
          // if NOT empty
          setAlert({
            open: true,
            message: `The Category "${categoryName.toUpperCase()}" is not empty`,
            type: "warning",
          });
        }
      }
    });
    return unsub;
  }, [categoryName, deleteTrigger, setAlert, setConfirm]);

  const handleSelectCategory = (catName) => {
    navigate(`/listing/${catName}`);
  };

  const handleDeleteCategory = (category) => {
    // it is necessary to trigger useEffect
    setDeleteTrigger((prevState) => !prevState);
    setCategoryName(category.categoryName);
    setCategory(category);
  };

  const handleModifyCategory = (catId) => {
    navigate(`/modifycategory/${catId}`);
  };

  return (
    <Grid className={classes.gridRoot} container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h3">Categories</Typography>
      </Grid>
      <Grid className={classes.catBtn} item xs={12} md={6}>
        {isAdmin && (
          <Button onClick={() => navigate("/newcategory")} variant="contained" color="primary">
            Add New Category
          </Button>
        )}
      </Grid>

      {loading && (
        <Grid item xs={12}>
          <ProgressCircle />
        </Grid>
      )}

      {!categories && !loading && (
        <Grid item xs={12}>
          <Typography variant="h6">There is no categories yet.</Typography>
        </Grid>
      )}

      <Grid item xs={12}>
        <Divider style={{ margin: "1rem 0" }} />
      </Grid>

      {categories &&
        categories.map((category, index) => {
          const len = category.pictureList.length;
          const rndIndex = Math.floor(Math.random() * len);
          const catId = category.id;
          const catName = category.categoryName;
          // test
          const count = categoryCount[index]?.catLen;
          // end of test
          return (
            <Grid key={catId} item xs={12} sm={6} md={4} lg={3}>
              <Badge
                classes={{ root: classes.badgeRoot, badge: classes.badgeBadge }}
                invisible={!isAdmin}
                showZero
                badgeContent={count}
              >
                <PictureCard
                  id={catId}
                  title={catName}
                  imageUrl={category.pictureList[rndIndex].url}
                  onClick={() => handleSelectCategory(catName)}
                  onDelete={() => handleDeleteCategory(category)}
                  onEdit={() => handleModifyCategory(catId, catName)}
                />
              </Badge>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default Categories;
