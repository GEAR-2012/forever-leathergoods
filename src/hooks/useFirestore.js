import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const useFirestore = () => {
  const [categories, setCategories] = useState();
  const [specifications, setSpecifications] = useState();

  // fetch Categories
  useEffect(() => {
    const collectionRef = collection(db, "categories");
    const unsub = onSnapshot(collectionRef, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        const id = doc.id;
        docs.push({ id, ...doc.data() });
      });
      setCategories(docs);
    });
    return unsub;
  }, []);

  // fetch Specifications
  useEffect(() => {
    const collectionRef = collection(db, "specifications");
    const q = query(collectionRef, orderBy("index"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => {
        const id = doc.id;
        let key1;
        let value1;
        let key2;
        let value2;
        for (const [key, value] of Object.entries(doc.data())) {
          if (key === "index") {
            key1 = key;
            value1 = value;
          } else if (key !== "createdAt" && key !== "modifiedAt") {
            key2 = key;
            value2 = value;
          }
        }
        docs.push({ [key1]: value1, [key2]: value2, id });
      });
      setSpecifications(docs);
    });
    return unsub;
  }, []);

  return { categories, specifications };
};

export default useFirestore;
