import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../firebase/firebase-auth";
import { checkOrientation } from "../functions/functions";
import useListenCategories from "../hooks/use-listen-categories";
import useListenSpecifications from "../hooks/use-listen-specifications";

const AppContext = createContext();

const Context = ({ children }) => {
  // image placeholder
  const placeholderImgUrl = "https://via.placeholder.com/350?text=No+Picture";

  const [getCategories, setGetCategories] = useState();
  const [getSpecifications, setGetSpecifications] = useState();

  // style mode
  const [darkMode, setDarkMode] = useState(true);

  // is the used device vertical?
  const [isVertical, setIsVertical] = useState();

  // Admin
  const [isAdmin, setIsAdmin] = useState();
  const [currentUser, setCurrentUser] = useState(null);

  // Login / Sign Up Modal
  const [openAuth, setOpenAuth] = useState(false);

  // Image Modal
  const [imageModal, setImageModal] = useState({
    open: false,
    pictures: [],
    index: 0,
  });

  // Progress of image upload
  const [progress, setProgress] = useState(0);

  // Confirm Modal
  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    response: false,
  });

  // snackbar:
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // getting 'categories'
  const categories = useListenCategories();
  useEffect(() => {
    if (categories) {
      setGetCategories(categories);
    }
  }, [categories]);

  // getting 'specifications'
  const specifications = useListenSpecifications();
  useEffect(() => {
    if (specifications) {
      setGetSpecifications(specifications);
    }
  }, [specifications]);

  // getting the used device's orientation
  useEffect(() => {
    setIsVertical(checkOrientation());
  }, []);

  window.addEventListener("resize", () => {
    setIsVertical(checkOrientation());
  });

  // setting the current user
  const authenticatedUser = useAuth();
  useEffect(() => {
    setCurrentUser(authenticatedUser);
  }, [authenticatedUser]);

  // setting the logged in user's role
  useEffect(() => {
    if (!currentUser) {
      setIsAdmin(false);
    } else {
      if (currentUser.role === "admin" && currentUser.emailVerified) {
        setIsAdmin(true);
      } else if (currentUser.role === "basic" || !currentUser.emailVerified) {
        setIsAdmin(false);
      }
    }
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        placeholderImgUrl,
        getCategories,
        getSpecifications,
        darkMode,
        setDarkMode,
        isVertical,
        isAdmin,
        currentUser,
        openAuth,
        setOpenAuth,
        imageModal,
        setImageModal,
        progress,
        setProgress,
        confirm,
        setConfirm,
        alert,
        setAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Context;

export const AppState = () => {
  return useContext(AppContext);
};
