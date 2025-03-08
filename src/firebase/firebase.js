// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvogBB5n_6TS-o8Rr0m_z7Ke3wCsgEAaQ",
  authDomain: "auction-web-application.firebaseapp.com",
  projectId: "auction-web-application",
  storageBucket: "auction-web-application.firebasestorage.app",
  messagingSenderId: "791551125015",
  appId: "1:791551125015:web:e1501ef04ba6c5d796de52",
  measurementId: "G-N0MTR5113N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)

export {app, auth, db}