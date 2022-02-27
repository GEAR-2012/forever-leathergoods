import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const useListenToProductCategory = (catName) => {
  const [products, setProducts] = useState();

  useEffect(() => {
    const collectionRef = collection(db, "products");
    const q = query(collectionRef, where("category", "==", catName));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const productArray = [];
      querySnapshot.forEach((doc) => {
        productArray.push({ ...doc.data(), id: doc.id });
      });
      setProducts(productArray);
    });

    return unsub;
  }, [catName]);

  return products;
};

export default useListenToProductCategory;
