/*
====================================
AARIKA Firebase Initializer
Version: v0.1 Genesis
====================================
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyChmido34vQI3H7kE7dPRiirr7xGySiggw",
  authDomain: "aarika-production.firebaseapp.com",
  projectId: "aarika-production",
  storageBucket: "aarika-production.firebasestorage.app",
  messagingSenderId: "659399557320",
  appId: "1:659399557320:web:d72d983f7405aa1cbc25fd",
  measurementId: "G-60SF582XJS"
};

const app = initializeApp(firebaseConfig);

export default app;
