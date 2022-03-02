import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

const useListenCategories = () => {
  const [categories, setCategories] = useState();

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

  return categories;
};

export default useListenCategories;
