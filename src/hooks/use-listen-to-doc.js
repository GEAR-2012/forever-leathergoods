import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { AppState } from "../context/app-context";

const useListenToDoc = (collectionName, docId) => {
  const { setAlert } = AppState();
  const [docGet, setDocGet] = useState();

  useEffect(() => {
    const docRef = doc(db, collectionName, docId);

    let unsub;

    if (collectionName && docId) {
      try {
        unsub = onSnapshot(docRef, (doc) => {
          setDocGet({ ...doc.data(), id: doc.id });
        });
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }

    return unsub;
  }, [collectionName, docId, setAlert]);

  return docGet;
};

export default useListenToDoc;
