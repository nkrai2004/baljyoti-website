// AARIKA School ERP
// Firebase configuration

const AARIKA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxtqt-TQZ0kkbo5l5qO9aBmV36NxqPctk",
  authDomain: "aarika-school-erp.firebaseapp.com",
  projectId: "aarika-school-erp",
  storageBucket: "aarika-school-erp.firebasestorage.app",
  messagingSenderId: "927822693870",
  appId: "1:927822693870:web:2fd0a143d9ef196d6c7aff"
};

// Named export required by auth.js and other modules
export { AARIKA_FIREBASE_CONFIG };

// Also expose globally for legacy/non-module scripts
window.AARIKA_FIREBASE_CONFIG = AARIKA_FIREBASE_CONFIG;
