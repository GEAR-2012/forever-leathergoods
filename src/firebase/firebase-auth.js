import { auth, db } from "./config";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";

export const signup = (email, pwd) => {
  return createUserWithEmailAndPassword(auth, email, pwd);
};

export const createUserDocument = (user, additionalData) => {
  if (!user) return;

  const { uid } = user;
  const { userName, role } = additionalData;

  try {
    const docRef = doc(db, "users", uid);
    setDoc(docRef, { userName, role, createdAt: serverTimestamp() });
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  return signOut(auth);
};

export const login = (email, pwd) => {
  return signInWithEmailAndPassword(auth, email, pwd);
};

// Custom Hook
export const useAuth = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // add additional data from database to the user from auth
      if (user) {
        const docRef = await doc(db, "users", user.uid);
        const additional = await getDoc(docRef);
        const userInfo = additional.data();
        user = Object.assign(user, userInfo);
      }
      setAuthenticatedUser(user);
    });
    return unsub;
  }, []);

  return authenticatedUser;
};
