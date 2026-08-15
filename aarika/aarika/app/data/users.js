// AARIKA user profile service
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAarikaFirebase } from "../firebase.js";

const DEFAULT_ROLE = "VIEWER";
const DEFAULT_STATUS = "PENDING";

export async function getOrCreateUserProfile(firebaseUser) {
  if (!firebaseUser?.uid) throw new Error("A valid authenticated user is required.");

  const { db } = getAarikaFirebase();
  const ref = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };

  const profile = {
    uid: firebaseUser.uid,
    email: (firebaseUser.email || "").toLowerCase(),
    displayName: firebaseUser.displayName || "",
    photoURL: firebaseUser.photoURL || "",
    roleId: DEFAULT_ROLE,
    schoolId: null,
    status: DEFAULT_STATUS,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(ref, profile);
  return { id: firebaseUser.uid, ...profile };
}
