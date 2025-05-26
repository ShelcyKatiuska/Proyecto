// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";





const Firebase = {
  apiKey: "AIzaSyBQet7z6iIIbzX6ws_1pJ-dRWc_ppAKbN0",
  authDomain: "proyectoweb-8ec59.firebaseapp.com",
  projectId: "proyectoweb-8ec59",
  storageBucket: "proyectoweb-8ec59.appspot.com",
  messagingSenderId: "560669306989",
  appId: "1:560669306989:web:2f0520f8b3683361430f64",
  measurementId: "G-KG12XX7T89"
};

const app = initializeApp(Firebase);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
