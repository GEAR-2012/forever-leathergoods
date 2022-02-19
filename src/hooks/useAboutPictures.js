import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { AppState } from "../context/app-context";
import { db } from "../firebase/config";

const useAboutPictures = (docPath, documentToUpload) => {
  const { setAlert } = AppState();

  useEffect(() => {
    try {
      const uploadTask = async () => {
        // references
        const docRef = doc(db, docPath);
        await setDoc(docRef, documentToUpload);

        setAlert({
          open: true,
          message: `Document is uploaded into ${docPath} document.`,
          type: "success",
        });
      };

      if (documentToUpload) {
        uploadTask();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error,
        type: "error",
      });
    }
  }, [documentToUpload, setAlert, docPath]);
};

export default useAboutPictures;
