// AARIKA Authentication
// Google Identity Services + Firebase Authentication
// Only @baljyoti.com accounts are allowed.

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  AARIKA_FIREBASE_CONFIG
} from "./firebase-config.js";


/* =========================
   FIREBASE INITIALIZATION
   ========================= */

const app = initializeApp(AARIKA_FIREBASE_CONFIG);

const firebaseAuth = getAuth(app);


/* =========================
   AARIKA SETTINGS
   ========================= */

const ALLOWED_DOMAIN = "baljyoti.com";

const DEMO_USERS = {
  "info@baljyoti.com": {
    role: "SUPER_ADMIN",
    schoolId: "PLATFORM"
  },

  "admin@baljyoti.com": {
    role: "SCHOOL_ADMIN",
    schoolId: "BJPS"
  },

  "teacher@baljyoti.com": {
    role: "TEACHER",
    schoolId: "BJPS"
  }
};


/* =========================
   LOGIN ERROR
   ========================= */

function error(message) {

  const e = document.getElementById("loginError");

  if (e) {
    e.hidden = false;
    e.textContent = message;
  }

  console.error("AARIKA Login:", message);
}


/* =========================
   DECODE GOOGLE JWT
   ========================= */

function jwt(token) {

  const base64 = token
    .split(".")[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  return JSON.parse(
    decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          c =>
            "%" +
            ("00" + c.charCodeAt(0).toString(16))
              .slice(-2)
        )
        .join("")
    )
  );
}


/* =========================
   GOOGLE LOGIN
   ========================= */

async function handleGoogleCredential(response) {

  try {

    console.log(
      "AARIKA: Google credential received."
    );


    /* -------------------------
       READ GOOGLE USER
       ------------------------- */

    const profile = jwt(response.credential);

    const email =
      (profile.email || "").toLowerCase();


    console.log(
      "AARIKA Google account:",
      email
    );


    /* -------------------------
       VERIFY EMAIL
       ------------------------- */

    if (!profile.email_verified) {

      error(
        "Your Google email could not be verified."
      );

      return;
    }


    /* -------------------------
       VERIFY DOMAIN
       ------------------------- */

    if (
      !email.endsWith(
        "@" + ALLOWED_DOMAIN
      )
    ) {

      error(
        "Please use your authorised @baljyoti.com account."
      );

      return;
    }


    /* -------------------------
       FIREBASE AUTHENTICATION
       ------------------------- */

    console.log(
      "AARIKA: Signing in to Firebase Authentication..."
    );


    const credential =
      GoogleAuthProvider.credential(
        response.credential
      );


    const firebaseResult =
      await signInWithCredential(
        firebaseAuth,
        credential
      );


    const firebaseUser =
      firebaseResult.user;


    console.log(
      "AARIKA: Firebase Authentication successful.",
      firebaseUser.email
    );


    /* -------------------------
       DOUBLE CHECK FIREBASE EMAIL
       ------------------------- */

    const firebaseEmail =
      (
        firebaseUser.email || ""
      ).toLowerCase();


    if (
      !firebaseEmail.endsWith(
        "@" + ALLOWED_DOMAIN
      )
    ) {

      await signOut(firebaseAuth);

      error(
        "Only authorised @baljyoti.com accounts can access AARIKA."
      );

      return;
    }


    /* -------------------------
       DETERMINE AARIKA ROLE
       ------------------------- */

    const user =
      DEMO_USERS[firebaseEmail] || {
        role: "SCHOOL_ADMIN",
        schoolId: "BJPS"
      };


    /* -------------------------
       SAVE APPLICATION SESSION
       ------------------------- */

    sessionStorage.setItem(
      "aarikaSession",
      JSON.stringify({

        authenticated: true,

        uid:
          firebaseUser.uid,

        email:
          firebaseEmail,

        name:
          firebaseUser.displayName ||
          profile.name ||
          firebaseEmail,

        picture:
          firebaseUser.photoURL ||
          profile.picture ||
          "",

        role:
          user.role,

        schoolId:
          user.schoolId,

        loginAt:
          new Date().toISOString()
      })
    );


    console.log(
      "AARIKA: Session created.",
      user.role
    );


    /* -------------------------
       REDIRECT
       ------------------------- */

    if (
      user.role === "SUPER_ADMIN"
    ) {

      location.href =
        "pages/super-admin.html";

    } else if (
      user.role === "TEACHER"
    ) {

      location.href =
        "pages/teacher-dashboard.html";

    } else {

      location.href =
        "pages/dashboard.html";
    }


  } catch (e) {

    console.error(
      "AARIKA Firebase authentication failed:",
      e
    );


    error(
      "Unable to complete Google sign-in. " +
      (e.message || "Please try again.")
    );
  }
}


/* =========================
   CHECK FIREBASE AUTH
   ========================= */

function watchFirebaseAuth(callback) {

  return onAuthStateChanged(
    firebaseAuth,
    callback
  );
}


/* =========================
   REQUIRE AARIKA SESSION
   ========================= */

function requireSession(role) {

  const x =
    sessionStorage.getItem(
      "aarikaSession"
    );


  if (!x) {

    location.href =
      "../index.html";

    return null;
  }


  let session;

  try {

    session =
      JSON.parse(x);

  } catch (e) {

    sessionStorage.removeItem(
      "aarikaSession"
    );

    location.href =
      "../index.html";

    return null;
  }


  if (
    !session.authenticated
  ) {

    location.href =
      "../index.html";

    return null;
  }


  if (
    role &&
    session.role !== role
  ) {

    location.href =
      "access-denied.html";

    return null;
  }


  return session;
}


/* =========================
   LOGOUT
   ========================= */

async function logout() {

  try {

    await signOut(
      firebaseAuth
    );

  } catch (e) {

    console.error(
      "Firebase logout failed:",
      e
    );
  }


  sessionStorage.removeItem(
    "aarikaSession"
  );


  location.href =
    "../index.html";
}


/* =========================
   GLOBAL FUNCTIONS
   ========================= */

window.handleGoogleCredential =
  handleGoogleCredential;

window.requireSession =
  requireSession;

window.logout =
  logout;

window.watchFirebaseAuth =
  watchFirebaseAuth;
