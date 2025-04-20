// firebase/login.ts
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "./index";
import { doc, setDoc, getDoc } from "firebase/firestore";


export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;


    const userRef = doc(db, "users", user.uid);
    const existing = await getDoc(userRef);


    // ✅ Only create if user doesn't exist
    if (!existing.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
    }


    return true;
  } catch (error) {
    console.error("Login Failed:", error);
    return false;
  }
};
