import { useEffect } from "react";
import { db, storage, timestamp } from "../firebase/config";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { AppState } from "../context/app-context";

const useDeletePicture = (folderName, docId, pic) => {
  const { setAlert } = AppState();

  useEffect(() => {
    const deleteFromFirestore = (folder, id, url, name) => {
      // reference
      const docRef = doc(db, folder, id);
      const arrItem = { name, url };
      updateDoc(docRef, {
        pictureList: arrayRemove(arrItem),
        updatedAt: timestamp(),
      });
    };

    const deleteFromStorage = (folder, name) => {
      // reference
      const objRef = ref(storage, `${folder}/${name}`);
      deleteObject(objRef)
        .then(() => {
          setAlert({
            open: true,
            message: "Image has been deleted",
            type: "info",
          });
        })
        .catch((err) => setAlert({ open: true, message: err.message, type: "error" }));
    };

    if (folderName && docId && pic) {
      try {
        deleteFromFirestore(folderName, docId, pic.url, pic.name);
        deleteFromStorage(folderName, pic.name);
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }
  }, [folderName, docId, pic, setAlert]);
};

export default useDeletePicture;
