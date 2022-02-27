import { useEffect, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db, timestamp } from "../firebase/config";
import { AppState } from "../context/app-context";

const useUpdateDoc = async (collectionName, documentId, documentToUpdate) => {
  const { setAlert } = AppState();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (collectionName && documentId && documentToUpdate) {
      const uploadTask = async (collName, id, docToUpdate) => {
        // references
        const documentRef = doc(db, collName, id);
        const modifiedAt = timestamp();
        await updateDoc(documentRef, { ...docToUpdate, modifiedAt });
        setIsUpdated(true); // hook return data

        setAlert({
          open: true,
          message: "Document has been updated",
          type: "success",
        });
      };

      try {
        if (collectionName && documentId && documentToUpdate) {
          uploadTask(collectionName, documentId, documentToUpdate);
        }
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }
  }, [collectionName, documentId, documentToUpdate, setAlert]);

  return isUpdated;
};

export default useUpdateDoc;
