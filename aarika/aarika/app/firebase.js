// AARIKA Firebase bootstrap
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { AARIKA_FIREBASE_CONFIG, isFirebaseConfigured } from "./firebase-config.js";

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

export function initializeAarikaFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error("AARIKA Firebase is not configured. Add the Firebase Web App configuration before starting authentication or database services.");
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(AARIKA_FIREBASE_CONFIG);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
  }

  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb
  };
}

export function getAarikaFirebase() {
  if (!firebaseApp || !firebaseAuth || !firebaseDb) {
    return initializeAarikaFirebase();
  }
  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb };
}
