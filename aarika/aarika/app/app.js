// AARIKA application entry point
// Google authentication -> authenticated Director -> dashboard.

import {
  signInWithGoogle,
  completeGoogleRedirect,
  observeAuth,
  logout
} from "./auth.js";

import { isFirebaseConfigured } from "./firebase-config.js";

const loginButton = document.querySelector("#googleLogin");
const logoutButton = document.querySelector("#logoutButton");
const status = document.querySelector("#status");
const userPanel = document.querySelector("#userPanel");

let routing = false;
let authInitialised = false;

function setStatus(message, error = false) {
  if (!status) return;

  status.textContent = message;
  status.dataset.error = error ? "true" : "false";
}

function isAuthorised(user) {
  return Boolean(
    user?.email &&
    user.email.toLowerCase().endsWith("@baljyoti.com")
  );
}

function showSignedInUser(user) {
  if (userPanel) {
    userPanel.hidden = false;
    userPanel.textContent =
      `${user.displayName || user.email} • Authenticated`;
  }

  if (loginButton) {
    loginButton.hidden = true;
    loginButton.disabled = false;
  }

  if (logoutButton) {
    logoutButton.hidden = false;
  }
}

/*
 * IMPORTANT:
 * GitHub Pages application path:
 *
 * https://nkrai2004.github.io/aarika-school-erp/app/
 *
 * Dashboard:
 *
 * https://nkrai2004.github.io/aarika-school-erp/app/dashboard.html
 *
 * Keep this explicit while we are developing on GitHub Pages.
 */
function dashboardUrl() {
  return `${window.location.origin}/aarika-school-erp/app/dashboard.html`;
}

function goToDashboard(user) {
  if (routing) return;

  if (!isAuthorised(user)) {
    setStatus(
      "Only authorised @baljyoti.com accounts can access AARIKA.",
      true
    );
    return;
  }

  routing = true;

  showSignedInUser(user);

  setStatus(
    "Authentication successful. Opening AARIKA dashboard…"
  );

  const target = dashboardUrl();

  console.log("AARIKA authenticated user:", user.email);
  console.log("AARIKA dashboard target:", target);

  /*
   * Small delay allows Firebase authentication state
   * and browser storage to settle before navigation.
   */
  setTimeout(() => {
    window.location.replace(target);
  }, 300);
}

async function login() {
  if (!isFirebaseConfigured()) {
    setStatus(
      "AARIKA is ready, but Firebase configuration is not connected yet.",
      true
    );
    return;
  }

  if (loginButton) {
    loginButton.disabled = true;
  }

  setStatus("Redirecting to secure Google sign-in…");

  try {
    await signInWithGoogle();
  } catch (error) {
    console.error("AARIKA Google login error:", error);

    setStatus(
      error?.message || "Unable to sign in.",
      true
    );

    if (loginButton) {
      loginButton.disabled = false;
    }
  }
}

async function doLogout() {
  try {
    await logout();
  } finally {
    routing = false;
    authInitialised = false;

    if (userPanel) {
      userPanel.hidden = true;
    }

    if (loginButton) {
      loginButton.hidden = false;
      loginButton.disabled = false;
    }

    if (logoutButton) {
      logoutButton.hidden = true;
    }

    setStatus("You have been signed out.");
  }
}

loginButton?.addEventListener("click", login);
logoutButton?.addEventListener("click", doLogout);

async function initialise() {
  if (!isFirebaseConfigured()) {
    setStatus(
      "Foundation ready — Firebase configuration is required for live sign-in."
    );
    return;
  }

  /*
   * First handle Google redirect authentication.
   */
  try {
    const redirectUser = await completeGoogleRedirect();

    if (redirectUser) {
      console.log(
        "AARIKA Google redirect completed:",
        redirectUser.email
      );

      authInitialised = true;

      goToDashboard(redirectUser);
      return;
    }
  } catch (error) {
    console.error(
      "AARIKA Google redirect error:",
      error
    );

    setStatus(
      error?.message ||
      "Google sign-in could not be completed.",
      true
    );

    if (loginButton) {
      loginButton.disabled = false;
    }

    return;
  }

  /*
   * Then listen for the Firebase authentication state.
   */
  observeAuth((user) => {
    console.log(
      "AARIKA Firebase auth state:",
      user ? user.email : "SIGNED OUT"
    );

    authInitialised = true;

    if (!user) {
      setStatus(
        "Sign in with your authorised Bal Jyoti Google account."
      );
      return;
    }

    if (!isAuthorised(user)) {
      setStatus(
        "Only authorised @baljyoti.com accounts can access AARIKA.",
        true
      );
      return;
    }

    /*
     * Firebase confirms the user.
     * Send directly to dashboard.
     */
    goToDashboard(user);
  });
}

initialise();
