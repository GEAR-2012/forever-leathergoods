import { useEffect } from "react";
import { db, timestamp } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { AppState } from "../context/app-context";
import { useState } from "react";

const useCreateDoc = async (collectionName, documentToUpload) => {
  const { setAlert } = AppState();
  const [docId, setDocId] = useState();

  useEffect(() => {
    const uploadTask = async (collName, docToCreate) => {
      // references
      const collectionRef = collection(db, collName);
      const createdAt = timestamp();
      const docRef = await addDoc(collectionRef, { ...docToCreate, createdAt });
      setDocId(docRef.id); // hook return data
      setAlert({
        open: true,
        message: `Document is uploaded into ${collName} collection with an id of ${docRef.id}.`,
        type: "success",
      });
    };

    try {
      if (collectionName && documentToUpload) {
        uploadTask(collectionName, documentToUpload);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error,
        type: "error",
      });
    }
  }, [collectionName, documentToUpload, setAlert]);

  return docId;
};

export default useCreateDoc;
