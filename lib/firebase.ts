import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDL6ZSqPyhXcV0LZRbflsF5hy40HbvB7lY",
  authDomain: "healthtracker-88cf8.firebaseapp.com",
  projectId: "healthtracker-88cf8",
  storageBucket: "healthtracker-88cf8.firebasestorage.app",
  messagingSenderId: "263168742111",
  appId: "1:263168742111:web:47a3476c038ffd1dfb8f6a",
  measurementId: "G-52WNJYXPYP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
