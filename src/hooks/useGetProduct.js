import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { AppState } from "../context/app-context";
import { db } from "../firebase/config";

const useGetProduct = (prodId) => {
  const { setAlert } = AppState();

  const [product, setProduct] = useState();

  useEffect(() => {
    const docRef = doc(db, "products", prodId);
    const getProduct = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ ...docSnap.data(), id: docSnap.id });
      } else {
        setAlert({
          open: true,
          message: "Document does not exists",
          type: "warning",
        });
        setProduct(null);
      }
    };

    try {
      getProduct();
    } catch (error) {
      setAlert({
        open: true,
        message: error,
        type: "error",
      });
    }
  }, [prodId, setAlert]);

  return product;
};

export default useGetProduct;
