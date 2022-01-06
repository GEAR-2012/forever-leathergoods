import { updateDoc, doc } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppState } from "../context/app-context";
import { db } from "../firebase/config";

const useUpdateDocument = (collection, documentId, documentToUpdate, redirectPath) => {
  const navigate = useNavigate();
  const { setAlert } = AppState();

  useEffect(() => {
    if (collection && documentId && documentToUpdate) {
      const docPath = `${collection}/${documentId}`;

      try {
        const uploadTask = async () => {
          // references
          const documentRef = doc(db, docPath);
          await updateDoc(documentRef, documentToUpdate);
          setAlert({
            open: true,
            message: "Document Successfully Updated.",
            type: "success",
          });
          if (redirectPath) {
            navigate(redirectPath);
          }
        };
        if (documentToUpdate) {
          uploadTask();
        }
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }
  }, [setAlert, navigate, collection, documentId, documentToUpdate, redirectPath]);
};

export default useUpdateDocument;
