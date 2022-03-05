import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Badge, Button, Divider, Grid, Typography } from "@mui/material";
import { db } from "../../firebase/config";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import PictureCard from "../UI/PictureCard";
import ProgressCircle from "../UI/ProgressCircle";
import useDeleteDocWithPics from "../../hooks/use-delete-doc-with-pics";
import { AppState } from "../../context/app-context";

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

  const { getCategories, setAlert, isAdmin, confirm, setConfirm, placeholderImgUrl } = AppState();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState();
  const [categoryCount, setCategoryCount] = useState([]);

  // clean up
  useEffect(() => {
    return () => {
      setCategories(null);
    };
  }, []);

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

          const catLen = await querySnap.docs.length;

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
  const [categoryIdToDelete, setCategoryIdToDelete] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [deleteTrigger, setDeleteTrigger] = useState(false);

  useDeleteDocWithPics("categories", categoryIdToDelete).then((resp) => {
    setCategoryIdToDelete(null);
  });

  // if the category deletion is justified
  useEffect(() => {
    if (confirm.response === true) {
      // trigger to delete category from firestore
      setCategoryIdToDelete(category?.id);
      setCategoryCount([]);
    }
    setConfirm({
      open: false,
      message: "",
      response: false,
    });
  }, [confirm.response, category?.id, setConfirm]);

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
        if (productArray.length === 0) {
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

  const selectCategoryHandler = (catName) => {
    navigate(`/listing/${catName}`);
  };

  const deleteCategoryHandler = (category) => {
    setDeleteTrigger((prevState) => !prevState);
    setCategoryName(category.categoryName);
    setCategory(category);
  };

  const modifyCategoryHandler = (catId) => {
    navigate(`/updatecategory/${catId}`);
  };

  return (
    <Grid className={classes.gridRoot} container sx={{ mb: 6 }} spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h3">Categories</Typography>
      </Grid>
      <Grid className={classes.catBtn} item xs={12} md={6}>
        {isAdmin && (
          <Button onClick={() => navigate("/createcategory")} variant="contained" color="primary">
            Create New Category
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
          let catPrevImgUrl = placeholderImgUrl;
          const len = category.pictureList.length;
          if (len > 0) {
            const rndIndex = Math.floor(Math.random() * len);
            catPrevImgUrl = category.pictureList[rndIndex].url;
          }
          const catId = category.id;
          const catName = category.categoryName;
          const count = categoryCount[index]?.catLen;
          return (
            <Grid key={catId} sx={{ mt: 4 }} item xs={12} sm={6} md={4} lg={3}>
              <Badge
                classes={{ root: classes.badgeRoot, badge: classes.badgeBadge }}
                invisible={!isAdmin}
                showZero
                badgeContent={count}
              >
                <PictureCard
                  id={catId}
                  title={catName}
                  imageUrl={catPrevImgUrl}
                  onClick={() => selectCategoryHandler(catName)}
                  onDelete={() => deleteCategoryHandler(category)}
                  onEdit={() => modifyCategoryHandler(catId, catName)}
                />
              </Badge>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default Categories;
