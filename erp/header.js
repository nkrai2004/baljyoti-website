(function () {
  const isSubfolder = window.location.pathname.includes('/modules/');
  const basePath = isSubfolder ? '../' : './';

  const headerTemplate = `
  <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
    <div class="flex items-center space-x-3">
      <a href="${basePath}dashboard.html" class="flex items-center space-x-3 hover:opacity-90 transition">
        <img src="${basePath}logo.png" alt="Bal Jyoti Logo" class="h-9 object-contain" onerror="this.style.display='none'">
        <span class="text-slate-300">|</span>
        <h1 class="text-base font-bold text-slate-900">Bal Jyoti Educational Portal</h1>
      </a>
    </div>

    <div class="flex items-center space-x-3">
      <a id="headerRbacBtn" href="${basePath}user-permissions.html" style="display: none;" class="items-center space-x-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition shadow-sm">
        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <span>Manage Users</span>
      </a>

      <div class="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
        <span id="headerUserBadge" class="text-xs font-mono font-bold text-slate-700">Loading...</span>
        <span id="headerRoleBadge" class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">GUEST</span>
      </div>

      <button onclick="globalLogout()" class="text-xs font-bold text-slate-500 hover:text-red-600 px-2 py-1.5 transition">
        Sign Out
      </button>
    </div>
  </header>
  `;

  function cleanStr(s) {
    return String(s || "").toLowerCase().trim();
  }

  // Detect logged-in email across Firebase, Session Storage, and Local Storage
  function getActiveUserEmail() {
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.email) {
      return firebase.auth().currentUser.email;
    }

    const sessionKeys = ["currentUserEmail", "userEmail", "loggedInUser", "user", "email"];
    for (const key of sessionKeys) {
      const val = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (val) {
        if (val.startsWith("{")) {
          try {
            const parsed = JSON.parse(val);
            if (parsed.email) return parsed.email;
          } catch(e) {}
        } else if (val.includes("@")) {
          return val;
        }
      }
    }

    return "guest@baljyoti.com";
  }

  function getResolvedRole(email) {
    const target = cleanStr(email);
    if (!target || target === "guest@baljyoti.com") return "Teacher";
    if (target === "info@baljyoti.com") return "Super Admin";

    const storageKeys = ["user_role_assignments", "user_roles", "users", "portal_users", "directory_users", "rbac_users"];
    for (const key of storageKeys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);

        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          for (const [k, v] of Object.entries(parsed)) {
            if (cleanStr(k) === target && v) return String(v);
          }
        }
        if (Array.isArray(parsed)) {
          const found = parsed.find(u => cleanStr(u.email || u.primaryEmail || u.userEmail) === target);
          if (found && (found.role || found.assignedRole || found.userRole)) {
            return String(found.role || found.assignedRole || found.userRole);
          }
        }
      } catch (e) {}
    }
    return "Teacher";
  }

  function injectHeader() {
    let container = document.getElementById("portalHeaderContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "portalHeaderContainer";
      document.body.prepend(container);
    }
    container.innerHTML = headerTemplate;
    updateAuthHeader();
  }

  function updateAuthHeader() {
    const currentEmail = getActiveUserEmail();
    const userBadge = document.getElementById("headerUserBadge");
    const roleBadge = document.getElementById("headerRoleBadge");
    const rbacBtn = document.getElementById("headerRbacBtn");

    const assignedRole = getResolvedRole(currentEmail);

    if (userBadge) userBadge.innerText = currentEmail;
    if (roleBadge) roleBadge.innerText = assignedRole.toUpperCase();

    if (rbacBtn) {
      if (cleanStr(currentEmail) === "info@baljyoti.com") {
        rbacBtn.style.display = "inline-flex";
      } else {
        rbacBtn.style.display = "none";
      }
    }
  }

  window.globalLogout = function () {
    sessionStorage.clear();
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      firebase.auth().signOut().then(() => {
        window.location.href = basePath + "index.html";
      });
    } else {
      window.location.href = basePath + "index.html";
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectHeader);
  } else {
    injectHeader();
  }

  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(() => {
      updateAuthHeader();
    });
  }

  window.addEventListener("storage", (e) => {
    if (["user_role_assignments", "user_roles", "users", "currentUserEmail"].includes(e.key)) {
      updateAuthHeader();
    }
  });
})();
