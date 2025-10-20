// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAre8XwoR63tQXmDEJiNP7cTg-IG-J-FF0",
  authDomain: "oikosbsw.firebaseapp.com",
  projectId: "oikosbsw",
  storageBucket: "oikosbsw.appspot.com", // ✅ fixed ito (dapat .appspot.com, hindi .app)
  messagingSenderId: "835172477245",
  appId: "1:835172477245:web:55384e7e68a867963ffd54",
  measurementId: "G-E3SP92405J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
