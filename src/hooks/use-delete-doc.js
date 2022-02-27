import { useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { AppState } from "../context/app-context";

const useDeleteDoc = (collectionName, documentId) => {
  const { setAlert, setConfirm } = AppState();

  useEffect(() => {
    if (collectionName && documentId) {
      // references
      const docRef = doc(db, collectionName, documentId);

      try {
        deleteDoc(docRef);
        setAlert({
          open: true,
          message: "Document has been deleted",
          type: "success",
        });
        setConfirm((prevState) => ({
          ...prevState,
          response: false,
        }));
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }
  }, [collectionName, documentId, setAlert, setConfirm]);
};

export default useDeleteDoc;
