// AARIKA Director Dashboard
// Stable Firebase session handling for GitHub Pages
// No automatic redirect back to login while debugging.

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getAarikaFirebase } from "./firebase.js";

const ALLOWED_DOMAIN = "baljyoti.com";

const state = {
  user: null,
  currentSection: "dashboard",
  authChecked: false
};

const sections = {
  dashboard: {
    title: "Director Dashboard",
    subtitle: "School-wide overview and daily operations"
  },

  academic: {
    title: "Academic",
    subtitle: "Academic performance, classes, subjects and learning"
  },

  admissions: {
    title: "Admissions",
    subtitle: "Admissions pipeline and student intake"
  },

  attendance: {
    title: "Attendance",
    subtitle: "Student and staff attendance"
  },

  duties: {
    title: "Activity",
    subtitle: "School activities, events and daily duties"
  },

  school: {
    title: "Administration",
    subtitle: "School administration and operations"
  },

  transport: {
    title: "Transport",
    subtitle: "Routes, buses, drivers and transport operations"
  },

  maintenance: {
    title: "Maintenance",
    subtitle: "Facilities, maintenance and service requests"
  },

  reports: {
    title: "Reports & Audit",
    subtitle: "Management reports, controls and audit"
  },

  ai: {
    title: "AI Intelligence",
    subtitle: "AARIKA AI-powered school intelligence"
  }
};


// --------------------------------------------------
// DEMO DATA
// --------------------------------------------------

const demo = {
  students: 1248,
  teachers: 86,
  attendance: 94.6,
  admissions: 73,
  pendingFees: 1840000,
  activities: 12,
  maintenance: 7
};


// --------------------------------------------------
// DOM
// --------------------------------------------------

const contentArea = document.querySelector("#contentArea");
const pageTitle = document.querySelector("#pageTitle");
const pageSubtitle = document.querySelector("#pageSubtitle");

const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");

const schoolName = document.querySelector("#schoolName");
const role = document.querySelector("#role");
const avatar = document.querySelector("#avatar");

const signOutButton = document.querySelector("#signOut");
const mobileMenu = document.querySelector("#mobileMenu");
const sidebar = document.querySelector("#sidebar");


// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function isAuthorised(user) {

  const email = (user?.email || "")
    .trim()
    .toLowerCase();

  return (
    email &&
    email.endsWith(`@${ALLOWED_DOMAIN}`)
  );
}


function formatCurrency(value) {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}


function setUser(user) {

  const name =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Director";

  const email =
    user?.email ||
    "";

  if (userName) {
    userName.textContent = name;
  }

  if (userEmail) {
    userEmail.textContent = email;
  }

  if (avatar) {

    avatar.textContent =
      name.charAt(0).toUpperCase();

  }
}


// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

function setupNavigation() {

  const buttons =
    document.querySelectorAll("[data-section]");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const section =
        button.dataset.section;

      if (!sections[section]) return;

      state.currentSection = section;

      buttons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderSection(section);

      if (sidebar) {
        sidebar.classList.remove("open");
      }

    });

  });

}


// --------------------------------------------------
// HEADER
// --------------------------------------------------

function updateHeader(section) {

  const config =
    sections[section];

  if (!config) return;

  if (pageTitle) {
    pageTitle.textContent =
      config.title;
  }

  if (pageSubtitle) {
    pageSubtitle.textContent =
      config.subtitle;
  }

}


// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

function renderDashboard() {

  return `

    <div class="welcome">

      <div>
        <h1>Good morning, Director</h1>

        <p>
          Welcome to AARIKA.
          Here is today's school overview.
        </p>
      </div>

      <div class="date">
        ${new Date().toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        )}
      </div>

    </div>


    <div class="cards">

      <div class="card">
        <span>Students</span>
        <strong>${demo.students.toLocaleString("en-IN")}</strong>
        <small>Currently enrolled</small>
      </div>

      <div class="card">
        <span>Teachers & Staff</span>
        <strong>${demo.teachers}</strong>
        <small>Active personnel</small>
      </div>

      <div class="card">
        <span>Attendance</span>
        <strong>${demo.attendance}%</strong>
        <small>Today's attendance</small>
      </div>

      <div class="card">
        <span>Admissions</span>
        <strong>${demo.admissions}</strong>
        <small>Active applications</small>
      </div>

    </div>


    <div class="grid">

      <div class="panel">

        <div class="panel-head">
          <h3>Academic Snapshot</h3>
          <button data-section="academic">
            Open
          </button>
        </div>

        <div class="metric-row">
          <span>Overall attendance</span>
          <b>${demo.attendance}%</b>
        </div>

        <div class="metric-row">
          <span>Active students</span>
          <b>${demo.students}</b>
        </div>

        <div class="metric-row">
          <span>Teaching staff</span>
          <b>${demo.teachers}</b>
        </div>

      </div>


      <div class="panel">

        <div class="panel-head">
          <h3>Administration</h3>
          <button data-section="school">
            Open
          </button>
        </div>

        <div class="metric-row">
          <span>Pending maintenance</span>
          <b>${demo.maintenance}</b>
        </div>

        <div class="metric-row">
          <span>Activities this month</span>
          <b>${demo.activities}</b>
        </div>

        <div class="metric-row">
          <span>Pending fees</span>
          <b>${formatCurrency(demo.pendingFees)}</b>
        </div>

      </div>

    </div>


    <div class="quick">

      <h3>Quick Access</h3>

      <div class="quick-grid">

        <button data-section="academic">
          Academic
        </button>

        <button data-section="admissions">
          Admissions
        </button>

        <button data-section="attendance">
          Attendance
        </button>

        <button data-section="duties">
          Activity
        </button>

        <button data-section="school">
          Administration
        </button>

        <button data-section="reports">
          Reports & Audit
        </button>

        <button data-section="ai">
          AI Intelligence
        </button>

      </div>

    </div>

  `;
}


// --------------------------------------------------
// GENERIC MODULE
// --------------------------------------------------

function renderModule(section) {

  const config =
    sections[section];

  return `

    <div class="module-header">

      <div>
        <h1>${config.title}</h1>
        <p>${config.subtitle}</p>
      </div>

      <button class="primary">
        + Add / Create
      </button>

    </div>


    <div class="cards">

      <div class="card">
        <span>Total Records</span>
        <strong>248</strong>
        <small>Demo data</small>
      </div>

      <div class="card">
        <span>Active</span>
        <strong>214</strong>
        <small>Currently active</small>
      </div>

      <div class="card">
        <span>Pending</span>
        <strong>23</strong>
        <small>Requires attention</small>
      </div>

      <div class="card">
        <span>Completed</span>
        <strong>11</strong>
        <small>This month</small>
      </div>

    </div>


    <div class="panel">

      <div class="panel-head">

        <h3>${config.title} Overview</h3>

        <button>
          View All
        </button>

      </div>


      <div class="table">

        <div class="table-head">
          <span>Item</span>
          <span>Status</span>
          <span>Updated</span>
        </div>

        <div class="table-row">
          <span>Demo record 001</span>
          <b>Active</b>
          <span>Today</span>
        </div>

        <div class="table-row">
          <span>Demo record 002</span>
          <b>Active</b>
          <span>Yesterday</span>
        </div>

        <div class="table-row">
          <span>Demo record 003</span>
          <b>Pending</b>
          <span>Today</span>
        </div>

        <div class="table-row">
          <span>Demo record 004</span>
          <b>Completed</b>
          <span>12 Aug 2026</span>
        </div>

      </div>

    </div>

  `;
}


// --------------------------------------------------
// AI MODULE
// --------------------------------------------------

function renderAI() {

  return `

    <div class="module-header">

      <div>
        <h1>AI Intelligence</h1>

        <p>
          AARIKA intelligence layer for
          school leadership.
        </p>
      </div>

    </div>


    <div class="ai-box">

      <div class="ai-icon">AI</div>

      <h2>School Intelligence</h2>

      <p>
        AI insights will analyse academic,
        attendance, admissions, activity and
        administration data.
      </p>

      <button class="primary">
        Generate Demo Insight
      </button>

    </div>


    <div class="cards">

      <div class="card">
        <span>Attendance Risk</span>
        <strong>3</strong>
        <small>Classes requiring attention</small>
      </div>

      <div class="card">
        <span>Academic Risk</span>
        <strong>8</strong>
        <small>Students flagged</small>
      </div>

      <div class="card">
        <span>Admissions</span>
        <strong>17</strong>
        <small>Follow-ups required</small>
      </div>

      <div class="card">
        <span>Operations</span>
        <strong>4</strong>
        <small>Open issues</small>
      </div>

    </div>

  `;
}


// --------------------------------------------------
// REPORTS
// --------------------------------------------------

function renderReports() {

  return `

    <div class="module-header">

      <div>

        <h1>Reports & Audit</h1>

        <p>
          Management reporting,
          compliance and audit controls.
        </p>

      </div>

    </div>


    <div class="report-grid">

      <button>
        Academic Performance
      </button>

      <button>
        Attendance Report
      </button>

      <button>
        Admissions Report
      </button>

      <button>
        Student Report
      </button>

      <button>
        Staff Report
      </button>

      <button>
        Fee Report
      </button>

      <button>
        Activity Report
      </button>

      <button>
        Audit Log
      </button>

    </div>

  `;
}


// --------------------------------------------------
// RENDER
// --------------------------------------------------

function renderSection(section) {

  updateHeader(section);

  if (!contentArea) return;

  if (section === "dashboard") {

    contentArea.innerHTML =
      renderDashboard();

  }

  else if (section === "ai") {

    contentArea.innerHTML =
      renderAI();

  }

  else if (section === "reports") {

    contentArea.innerHTML =
      renderReports();

  }

  else {

    contentArea.innerHTML =
      renderModule(section);

  }


  // Activate buttons created inside content

  contentArea
    .querySelectorAll("[data-section]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const target =
          button.dataset.section;

        state.currentSection =
          target;

        renderSection(target);

      });

    });

}


// --------------------------------------------------
// SIGN OUT
// --------------------------------------------------

async function handleSignOut() {

  try {

    const { auth } =
      getAarikaFirebase();

    await signOut(auth);

    window.location.href =
      "../index.html";

  }

  catch (error) {

    console.error(
      "AARIKA sign-out error:",
      error
    );

  }

}


// --------------------------------------------------
// MOBILE MENU
// --------------------------------------------------

function setupMobileMenu() {

  if (!mobileMenu || !sidebar) return;

  mobileMenu.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "open"
      );

    }
  );

}


// --------------------------------------------------
// AUTHENTICATION
// --------------------------------------------------

function startAuthentication() {

  let auth;

  try {

    const firebase =
      getAarikaFirebase();

    auth = firebase.auth;

  }

  catch (error) {

    console.error(error);

    if (contentArea) {

      contentArea.innerHTML = `

        <div class="auth-error">

          <h2>Firebase configuration error</h2>

          <p>
            AARIKA could not initialise Firebase.
          </p>

          <small>
            ${error.message}
          </small>

        </div>

      `;

    }

    return;

  }


  console.log(
    "AARIKA dashboard: waiting for Firebase authentication..."
  );


  onAuthStateChanged(
    auth,
    user => {

      console.log(
        "AARIKA authentication state:",
        user
      );


      state.authChecked = true;


      // --------------------------------------------
      // USER NOT FOUND
      // --------------------------------------------

      if (!user) {

        console.warn(
          "AARIKA: Firebase session not detected."
        );


        if (contentArea) {

          contentArea.innerHTML = `

            <div class="auth-error">

              <h2>Authentication session not detected</h2>

              <p>
                The dashboard loaded correctly,
                but Firebase has not detected a
                signed-in user.
              </p>

              <p>
                Please return to the AARIKA login
                page and sign in again.
              </p>

              <button
                class="primary"
                id="returnLogin"
              >
                Return to Login
              </button>

            </div>

          `;


          document
            .querySelector("#returnLogin")
            ?.addEventListener(
              "click",
              () => {

                window.location.href =
                  "../index.html";

              }
            );

        }

        return;

      }


      // --------------------------------------------
      // AUTHORISATION
      // --------------------------------------------

      if (!isAuthorised(user)) {

        console.error(
          "AARIKA: unauthorised user",
          user.email
        );


        if (contentArea) {

          contentArea.innerHTML = `

            <div class="auth-error">

              <h2>Access denied</h2>

              <p>
                Only authorised Bal Jyoti
                accounts can access AARIKA.
              </p>

              <p>
                Signed in as:
                <strong>
                  ${user.email || "Unknown"}
                </strong>
              </p>

              <button
                class="primary"
                id="logoutUnauthorized"
              >
                Sign Out
              </button>

            </div>

          `;


          document
            .querySelector("#logoutUnauthorized")
            ?.addEventListener(
              "click",
              handleSignOut
            );

        }

        return;

      }


      // --------------------------------------------
      // SUCCESS
      // --------------------------------------------

      console.log(
        "AARIKA: authenticated successfully:",
        user.email
      );


      state.user = user;

      setUser(user);

      if (schoolName) {

        schoolName.textContent =
          "Bal Jyoti Public School";

      }

      if (role) {

        role.textContent =
          "SUPER ADMIN";

      }


      renderSection(
        state.currentSection
      );


      // Highlight dashboard

      document
        .querySelectorAll("[data-section]")
        .forEach(button => {

          button.classList.toggle(
            "active",
            button.dataset.section ===
              state.currentSection
          );

        });

    }
  );

}


// --------------------------------------------------
// INITIALISE
// --------------------------------------------------

function initialise() {

  console.log(
    "AARIKA Director Dashboard initialising..."
  );


  setupNavigation();

  setupMobileMenu();


  signOutButton
    ?.addEventListener(
      "click",
      handleSignOut
    );


  startAuthentication();

}


initialise();
