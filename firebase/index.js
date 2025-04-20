'use client';

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Firebase Config
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqqrl0JTgZ6Q5dLFvJBjD_EpL-Pu-q4OA",
    authDomain: "feedbackaudioapp.firebaseapp.com",
    projectId: "feedbackaudioapp",
    storageBucket: "feedbackaudioapp.appspot.com",
    messagingSenderId: "330631156905",
    appId: "1:330631156905:web:ffd3020ded9296e5f8c5b8"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const firebase = { serverTimestamp };
export const db = getFirestore(app);