// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVzx99v4W13PmDnAUrrtYnvapQnUzQYwY",
  authDomain: "aspp-bbf36.firebaseapp.com",
  projectId: "aspp-bbf36",
  storageBucket: "aspp-bbf36.firebasestorage.app",
  messagingSenderId: "429957697717",
  appId: "1:429957697717:web:985632f4beee4645ae6efc",
  measurementId: "G-5Q6DGZGDBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);