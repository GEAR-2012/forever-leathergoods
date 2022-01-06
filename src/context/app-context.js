import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../firebase/firebase-auth";

const AppContext = createContext();

const Context = ({ children }) => {
  // style mode
  const [darkMode, setDarkMode] = useState(true);

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  // Login / Sign Up Modal
  const [openAuth, setOpenAuth] = useState(false);
  // Image Modal
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageModalPictures, setImageModalPictures] = useState([]);
  const [imageModalIndex, setImageModalIndex] = useState(0);

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
        openAuth,
        setOpenAuth,
        openImageModal,
        setOpenImageModal,
        imageModalPictures,
        setImageModalPictures,
        imageModalIndex,
        setImageModalIndex,
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
