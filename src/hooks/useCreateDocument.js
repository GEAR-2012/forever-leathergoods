import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { AppState } from "../context/app-context";
import { db } from "../firebase/config";

const useCreateDocument = (collectionName, documentToUpload) => {
  const { setAlert } = AppState();

  useEffect(() => {
    try {
      const uploadTask = async () => {
        // references
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, documentToUpload);

        setAlert({
          open: true,
          message: `Document is uploaded into ${collectionName} collection with an id of ${docRef.id}.`,
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
  }, [documentToUpload, setAlert, collectionName]);
};

export default useCreateDocument;
