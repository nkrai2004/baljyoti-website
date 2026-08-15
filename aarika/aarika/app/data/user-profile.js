// AARIKA user profile service
// Creates a minimal user document after successful Firebase authentication.

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { getAarikaFirebase } from "../firebase.js";

export async function getOrCreateUserProfile(firebaseUser) {
  if (!firebaseUser?.uid) {
    throw new Error("AARIKA user profile requires an authenticated Firebase user.");
  }

  const { db } = getAarikaFirebase();
  const ref = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }

  const profile = {
    uid: firebaseUser.uid,
    email: (firebaseUser.email || "").toLowerCase(),
    displayName: firebaseUser.displayName || "",
    photoURL: firebaseUser.photoURL || "",
    roleId: "VIEWER",
    schoolId: null,
    status: "PENDING_ASSIGNMENT",
    provider: "google",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(ref, profile);
  return { id: firebaseUser.uid, ...profile };
}
