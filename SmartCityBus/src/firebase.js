import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmUTrNJOvrB5LmOvdIIcave4rEWIe2vpM",
  authDomain: "du-smart-bus.firebaseapp.com",
  projectId: "du-smart-bus",
  storageBucket: "du-smart-bus.appspot.com",
  messagingSenderId: "876690341770",
  appId: "1:876690341770:web:3ae61644d68e7284795273",
  measurementId: "G-34CG7L81G2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const analytics = getAnalytics(app);
