import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAceKbf2ti2_lGAqFQ6zHpw5lTTXf-QNJE",
  authDomain: "forever-leather-goods.firebaseapp.com",
  projectId: "forever-leather-goods",
  storageBucket: "forever-leather-goods.appspot.com",
  messagingSenderId: "1033854264251",
  appId: "1:1033854264251:web:feb8ecb2cf74f17c961a9e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const timestamp = serverTimestamp;
