import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { AppState } from "../context/app-context";
import { db } from "../firebase/config";

const useGetAbout = (aboutDocPath) => {
  const { setAlert } = AppState();

  console.log("useGetAbout started");

  const [aboutDoc, setAboutDoc] = useState();

  useEffect(() => {
    const docRef = doc(db, aboutDocPath);
    const getAboutDoc = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAboutDoc(docSnap.data());
      } else {
        setAlert({
          open: true,
          message: "Document does not exists",
          type: "warning",
        });
        setAboutDoc(null);
      }
    };

    try {
      getAboutDoc();
    } catch (error) {
      setAlert({
        open: true,
        message: error,
        type: "error",
      });
    }
  }, [aboutDocPath, setAlert]);

  return aboutDoc;
};

export default useGetAbout;
