import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { AppState } from "../context/app-context";

const useGetDoc = (folderName, docId) => {
  const { setAlert } = AppState();
  const [returnData, setReturnData] = useState();

  useEffect(() => {
    const documentGetter = async (folder, id) => {
      // reference
      const docRef = doc(db, folder, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id };
      } else {
        return false;
      }
    };

    if (folderName && docId) {
      try {
        documentGetter(folderName, docId)
          .then((res) => setReturnData(res))
          .catch((err) => setAlert({ open: true, message: err.message, type: "error" }));
      } catch (error) {
        setAlert({
          open: true,
          message: error,
          type: "error",
        });
      }
    }
  }, [folderName, docId, setAlert]);

  return returnData;
};

export default useGetDoc;
