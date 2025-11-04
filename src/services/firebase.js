// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC-3oVTfxamT8lWTIECCQH6fIQFa_uVck",
  authDomain: "pass-f417f.firebaseapp.com",
  projectId: "pass-f417f",
  storageBucket: "pass-f417f.firebasestorage.app",
  messagingSenderId: "751947828343",
  appId: "1:751947828343:web:a09759bc69ac66ad880a72",
  measurementId: "G-WH0RQ7RR5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase app initialized:', app);
console.log('Firebase Auth initialized:', auth);
console.log('Firebase Firestore initialized:', db);

export { app, analytics, auth, db };