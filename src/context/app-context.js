import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../firebase/firebase-auth";
import { checkOrientation } from "../functions/functions";

const AppContext = createContext();

const Context = ({ children }) => {
  // style mode
  const [darkMode, setDarkMode] = useState(true);

  // is the used device vertical?
  const [isVertical, setIsVertical] = useState();

  useEffect(() => {
    setIsVertical(checkOrientation());
  }, []);

  window.addEventListener("resize", () => {
    setIsVertical(checkOrientation());
  });

  // image placeholder
  const placeholderImgUrl = "https://via.placeholder.com/350?text=No+Picture";

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState();

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

  // product pictures preview temporary
  // @ upload should reset
  const [picUrls, setPicUrls] = useState([]);
  const [storageFolder, setStorageFolder] = useState("regular");

  const handler = (role) => {
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const authenticatedUser = useAuth();

  useEffect(() => {
    handler(authenticatedUser?.role);
    setCurrentUser(authenticatedUser);
  }, [authenticatedUser]);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        isVertical,
        openAuth,
        setOpenAuth,
        imageModal,
        setImageModal,
        currentUser,
        handler,
        isAdmin,
        alert,
        setAlert,
        picUrls,
        setPicUrls,
        confirm,
        setConfirm,
        storageFolder,
        setStorageFolder,
        progress,
        setProgress,
        placeholderImgUrl,
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
