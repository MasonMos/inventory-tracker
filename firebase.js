// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOxG44Rh4F3ldFhe2ISorKGsL5Zg4y3Pw",
  authDomain: "inventory-management-b2d5b.firebaseapp.com",
  projectId: "inventory-management-b2d5b",
  storageBucket: "inventory-management-b2d5b.appspot.com",
  messagingSenderId: "889740669665",
  appId: "1:889740669665:web:b8c531c859a129a1747da0",
  measurementId: "G-HDEKD9CEFW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
