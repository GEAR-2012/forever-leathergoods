import { useEffect, useState } from "react";
import { db, storage } from "../firebase/config";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { AppState } from "../context/app-context";

const useDeleteDocWithPics = async (folderName, docId) => {
  const [deleted, setDeleted] = useState(false);
  const { setAlert } = AppState();

  useEffect(() => {
    //
    const getPicturesFromDoc = (folder, id) => {
      const myPromise = new Promise(async (resolve, reject) => {
        const docRef = doc(db, folder, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let picList = docSnap.data().pictureList.map((item) => item.name);
          resolve(picList);
        } else {
          setAlert({
            open: true,
            message: "Document not found (using use-delete-doc.js)!",
            type: "warning",
          });
          reject(false);
        }
      });

      return myPromise;
    };
    //
    const deletePicturesFromStorage = async (folder, picNameList) => {
      const promiseArr = [];
      picNameList.forEach(async (pic) => {
        const itemRef = ref(storage, `${folder}/${pic}`);
        const deleteTask = await deleteObject(itemRef);
        promiseArr.push(deleteTask);
      });
      Promise.all(promiseArr).then(() => {
        deleteOneDoc(docId);
      });
    };
    //
    const deleteOneDoc = (id) => {
      // doc reference
      const docRef = doc(db, folderName, id);
      deleteDoc(docRef);
    };
    //

    if (folderName && docId) {
      try {
        getPicturesFromDoc(folderName, docId)
          .then((list) => {
            return deletePicturesFromStorage(folderName, list);
          })
          .then(() => {
            setAlert({
              open: true,
              message: "Document has been deleted",
              type: "success",
            });
            setDeleted(true);
          })
          .catch((err) =>
            setAlert({
              open: true,
              message: err,
              type: "error",
            })
          );
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }
  }, [folderName, docId, setAlert]);

  return deleted;
};

export default useDeleteDocWithPics;
