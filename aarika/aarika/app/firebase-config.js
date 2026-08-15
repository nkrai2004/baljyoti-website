// AARIKA Firebase configuration
// Firebase Web configuration for the AARIKA School ERP project.
// These Firebase Web App values are safe to ship to the browser; access is
// controlled by Firebase Authentication, Firestore Security Rules and
// authorized domains.

export const AARIKA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxtqt-TQZ0kkbo5l5qO9aBmV36NxqPctk",
  authDomain: "aarika-school-erp.firebaseapp.com",
  projectId: "aarika-school-erp",
  storageBucket: "aarika-school-erp.firebasestorage.app",
  messagingSenderId: "927822693870",
  appId: "1:927822693870:web:2fd0a143d9ef196d6c7aff"
};

export function isFirebaseConfigured(config = AARIKA_FIREBASE_CONFIG) {
  return Boolean(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.appId
  );
}
