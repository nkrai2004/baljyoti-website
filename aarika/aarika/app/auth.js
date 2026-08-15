// AARIKA Authentication
// Google authentication through Firebase Authentication.
// Uses redirect authentication and explicit browser session persistence.

import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithRedirect,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getAarikaFirebase } from "./firebase.js";

const ALLOWED_DOMAIN = "baljyoti.com";

function assertAllowedUser(user) {
  const email = (user?.email || "").trim().toLowerCase();

  if (
    !user ||
    !email ||
    !email.endsWith(`@${ALLOWED_DOMAIN}`)
  ) {
    throw new Error(
      "Only authorised @baljyoti.com accounts can access AARIKA."
    );
  }

  if (user.emailVerified === false) {
    throw new Error(
      "Your Google email could not be verified."
    );
  }

  return user;
}

export async function signInWithGoogle() {
  const { auth } = getAarikaFirebase();

  // IMPORTANT:
  // Explicitly persist the Firebase authentication session
  // in the browser before starting Google redirect login.
  await setPersistence(
    auth,
    browserLocalPersistence
  );

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
    hd: ALLOWED_DOMAIN
  });

  await signInWithRedirect(
    auth,
    provider
  );
}

export async function completeGoogleRedirect() {
  const { auth } = getAarikaFirebase();

  const result =
    await getRedirectResult(auth);

  if (!result?.user) {
    return null;
  }

  try {
    return assertAllowedUser(
      result.user
    );
  } catch (error) {

    await signOut(auth);

    throw error;
  }
}

export function observeAuth(callback) {

  const { auth } =
    getAarikaFirebase();

  return onAuthStateChanged(
    auth,
    callback
  );
}

export async function logout() {

  const { auth } =
    getAarikaFirebase();

  await signOut(auth);
}

export {
  ALLOWED_DOMAIN
};
