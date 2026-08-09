// AARIKA Firebase configuration
// Replace the placeholder values with your Firebase Web App configuration.
// Firebase Console -> Project settings -> Your apps -> Web app
const AARIKA_FIREBASE_CONFIG = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.firebasestorage.app",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

const AARIKA_FIREBASE_ENABLED =
  AARIKA_FIREBASE_CONFIG.apiKey !== "REPLACE_ME" &&
  AARIKA_FIREBASE_CONFIG.projectId !== "REPLACE_ME";
