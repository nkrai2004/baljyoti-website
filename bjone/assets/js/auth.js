// Shared Firebase Authentication, role lookup and page guard.
(function () {
  const app = firebase.initializeApp(window.BALJYOTI_FIREBASE_CONFIG);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const $ = (id) => document.getElementById(id);

  async function getAssignedRole(user) {
    const snap = await db.collection("userRoles").doc(user.uid).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (data.active !== true) return null;
    if ((data.email || "").toLowerCase() !== (user.email || "").toLowerCase()) return null;
    return data.role;
  }

  function isSchoolEmail(email) {
    return !!email && email.toLowerCase().endsWith("@"+window.BALJYOTI_ALLOWED_DOMAIN);
  }

  function showMessage(message, isError=true) {
    const el = $("message");
    if (!el) return;
    el.textContent = message;
    el.className = "notice " + (isError ? "error" : "success");
    el.hidden = false;
  }

  async function routeUser(user) {
    if (!isSchoolEmail(user.email)) {
      await auth.signOut();
      showMessage("Please sign in with your official @baljyoti.com account.");
      return;
    }
    try {
      const role = await getAssignedRole(user);
      if (!role || !window.BJ_PORTALS[role]) {
        await auth.signOut();
        showMessage("Your account is not yet assigned an active ERP role. Please contact the ERP Administrator.");
        return;
      }
      sessionStorage.setItem("bjRole", role);
      sessionStorage.setItem("bjEmail", user.email);
      sessionStorage.setItem("bjName", user.displayName || user.email.split("@")[0]);
      window.location.href = "portals/" + window.BJ_PORTALS[role];
    } catch (err) {
      console.error(err);
      showMessage("Unable to verify your role. Please try again or contact the ERP Administrator.");
    }
  }

  window.BJ_AUTH = {
    auth, db, getAssignedRole, isSchoolEmail,
    async signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ hd: window.BALJYOTI_ALLOWED_DOMAIN, prompt: "select_account" });
      try {
        const result = await auth.signInWithPopup(provider);
        await routeUser(result.user);
      } catch (err) {
        console.error(err);
        showMessage(err.message || "Sign-in failed.");
      }
    },
    async signOut() {
      sessionStorage.clear();
      await auth.signOut();
      window.location.href = "../index.html";
    },
    async requireRole(expectedRole) {
      auth.onAuthStateChanged(async (user) => {
        if (!user) { window.location.href = "../index.html"; return; }
        if (!isSchoolEmail(user.email)) { await auth.signOut(); window.location.href = "../index.html"; return; }
        try {
          const role = await getAssignedRole(user);
          if (role !== expectedRole) { window.location.href = "../index.html"; return; }
          window.BJ_CURRENT_USER = user;
          window.BJ_CURRENT_ROLE = role;
          document.dispatchEvent(new CustomEvent("bj-auth-ready", {detail:{user, role}}));
        } catch (e) {
          console.error(e);
          document.body.innerHTML = "<main class='shell'><section class='panel'><h2>Access verification failed</h2><p>Please contact the ERP Administrator.</p></section></main>";
        }
      });
    },
    async requireModule(moduleKey, required="read") {
      auth.onAuthStateChanged(async (user) => {
        if (!user) { window.location.href = "../index.html"; return; }
        try {
          const role = await getAssignedRole(user);
          if (!role || !window.bjCanAccess(role, moduleKey, required)) {
            document.body.innerHTML = "<main class='shell'><section class='panel'><h2>Access denied</h2><p>Your assigned role does not have permission to open this module.</p><a href='../index.html'>Return to login</a></section></main>";
            return;
          }
          window.BJ_CURRENT_USER = user;
          window.BJ_CURRENT_ROLE = role;
          document.dispatchEvent(new CustomEvent("bj-module-ready", {detail:{user, role, moduleKey}}));
        } catch (e) {
          console.error(e);
          document.body.innerHTML = "<main class='shell'><section class='panel'><h2>Access verification failed</h2><p>Please contact the ERP Administrator.</p></section></main>";
        }
      });
    }
  };
})();
