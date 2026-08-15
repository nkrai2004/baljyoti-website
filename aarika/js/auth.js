// ============================================================
// AARIKA AUTHENTICATION
// Google Identity Services + Firebase Authentication
// Only @baljyoti.com accounts are allowed.
// ============================================================


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


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

const app =
  initializeApp(
    AARIKA_FIREBASE_CONFIG
  );


const firebaseAuth =
  getAuth(app);


// ============================================================
// AARIKA SETTINGS
// ============================================================

const ALLOWED_DOMAIN =
  "baljyoti.com";


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
  },

  "director@baljyoti.com": {
    role: "DIRECTOR",
    schoolId: "BJPS"
  }

};


// ============================================================
// LOGIN ERROR
// ============================================================

function error(message) {

  const e =
    document.getElementById(
      "loginError"
    );


  if (e) {

    e.hidden = false;

    e.textContent =
      message;

  }


  console.error(
    "AARIKA Login:",
    message
  );

}


// ============================================================
// DECODE GOOGLE JWT
// ============================================================

function jwt(token) {

  try {

    const base64 =
      token
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
              (
                "00" +
                c
                  .charCodeAt(0)
                  .toString(16)
              )
              .slice(-2)
          )
          .join("")

      )

    );

  } catch (e) {

    console.error(
      "AARIKA: Unable to decode Google token.",
      e
    );

    throw new Error(
      "Invalid Google authentication response."
    );

  }

}


// ============================================================
// GOOGLE LOGIN
// ============================================================

async function handleGoogleCredential(
  response
) {

  try {

    console.log(
      "AARIKA: Google credential received."
    );


    if (
      !response ||
      !response.credential
    ) {

      error(
        "Google did not return a valid login credential."
      );

      return;

    }


    // --------------------------------------------------------
    // READ GOOGLE USER
    // --------------------------------------------------------

    const profile =
      jwt(
        response.credential
      );


    const email =
      (
        profile.email ||
        ""
      ).toLowerCase();


    console.log(
      "AARIKA Google account:",
      email
    );


    // --------------------------------------------------------
    // VERIFY EMAIL
    // --------------------------------------------------------

    if (
      !profile.email_verified
    ) {

      error(
        "Your Google email could not be verified."
      );

      return;

    }


    // --------------------------------------------------------
    // VERIFY DOMAIN
    // --------------------------------------------------------

    if (
      !email.endsWith(
        "@" +
        ALLOWED_DOMAIN
      )
    ) {

      error(
        "Please use your authorised @baljyoti.com account."
      );

      return;

    }


    // --------------------------------------------------------
    // FIREBASE AUTHENTICATION
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // FIREBASE EMAIL CHECK
    // --------------------------------------------------------

    const firebaseEmail =
      (
        firebaseUser.email ||
        ""
      ).toLowerCase();


    if (
      !firebaseEmail.endsWith(
        "@" +
        ALLOWED_DOMAIN
      )
    ) {

      await signOut(
        firebaseAuth
      );


      error(
        "Only authorised @baljyoti.com accounts can access AARIKA."
      );

      return;

    }


    // --------------------------------------------------------
    // DETERMINE ROLE
    // --------------------------------------------------------

    const user =
      DEMO_USERS[
        firebaseEmail
      ] || {

        role:
          "SCHOOL_ADMIN",

        schoolId:
          "BJPS"

      };


    // --------------------------------------------------------
    // CREATE APPLICATION SESSION
    // --------------------------------------------------------

    const session = {

      authenticated:
        true,

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

    };


    sessionStorage.setItem(
      "aarikaSession",
      JSON.stringify(session)
    );


    console.log(
      "AARIKA: Session created.",
      session
    );


    // --------------------------------------------------------
    // REDIRECT
    // --------------------------------------------------------

    if (
      user.role ===
      "SUPER_ADMIN"
    ) {

      location.href =
        "pages/super-admin.html";

      return;

    }


    if (
      user.role ===
      "TEACHER"
    ) {

      location.href =
        "pages/teacher-dashboard.html";

      return;

    }


    if (
      user.role ===
      "DIRECTOR"
    ) {

      location.href =
        "pages/dashboard.html";

      return;

    }


    location.href =
      "pages/dashboard.html";


  } catch (e) {

    console.error(
      "AARIKA Firebase authentication failed:",
      e
    );


    error(
      "Unable to complete Google sign-in. " +
      (
        e.message ||
        "Please try again."
      )
    );

  }

}


// ============================================================
// GOOGLE CALLBACK BRIDGE
// ============================================================

window.addEventListener(
  "aarika-google-credential",
  event => {

    console.log(
      "AARIKA: Processing Google credential..."
    );


    handleGoogleCredential(
      event.detail
    );

  }
);


// ============================================================
// HANDLE CASE WHERE GOOGLE CALLBACK ARRIVED
// BEFORE auth.js FINISHED LOADING
// ============================================================

if (
  window.__AARIKA_GOOGLE_RESPONSE__
) {

  console.log(
    "AARIKA: Processing queued Google credential..."
  );


  const response =
    window.__AARIKA_GOOGLE_RESPONSE__;


  delete window.__AARIKA_GOOGLE_RESPONSE__;


  handleGoogleCredential(
    response
  );

}


// ============================================================
// FIREBASE AUTH STATE
// ============================================================

function watchFirebaseAuth(
  callback
) {

  return onAuthStateChanged(
    firebaseAuth,
    callback
  );

}


// ============================================================
// REQUIRE AARIKA SESSION
// ============================================================

function requireSession(
  role
) {

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


// ============================================================
// LOGOUT
// ============================================================

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


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.handleGoogleCredential =
  handleGoogleCredential;


window.requireSession =
  requireSession;


window.logout =
  logout;


window.watchFirebaseAuth =
  watchFirebaseAuth;
