// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAJrU9YYHD2LaNDc3153MiMup4Bkexb38",
  authDomain: "oikos-bsw-test.firebaseapp.com",
  projectId: "oikos-bsw-test",
  storageBucket: "oikos-bsw-test.firebasestorage.app",
  messagingSenderId: "551172706143",
  appId: "1:551172706143:web:e610d7f956798cee0bf0ea",
  measurementId: "G-X32HGWHH1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);