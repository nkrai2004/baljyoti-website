/* AARIKA Super Admin - School Setup
   Firestore is the ONLY source of school data.
   No localStorage is used for schools.
*/

let schools = [];
let firebase = null;

async function getFirebase() {
  if (!firebase) {
    firebase = await import("./firebase.js");

    if (!firebase.firebaseEnabled()) {
      throw new Error("Firebase is not enabled.");
    }
  }

  return firebase;
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function newId() {
  return "SCH-" + Date.now().toString().slice(-8);
}


/* =========================
   LOAD SCHOOLS FROM FIRESTORE
   ========================= */

async function loadSchools() {

  const box = document.getElementById("tenantRows");

  if (!box) return;

  try {

    box.innerHTML = `
      <tr>
        <td colspan="5">Loading schools...</td>
      </tr>
    `;

    const fb = await getFirebase();

    schools = await fb.listSchools();

    renderTenants();

  } catch (error) {

    console.error("Firestore school load failed:", error);

    box.innerHTML = `
      <tr>
        <td colspan="5">
          Unable to load schools.
          ${esc(error.message)}
        </td>
      </tr>
    `;
  }
}


/* =========================
   DISPLAY SCHOOLS
   ========================= */

function renderTenants() {

  const box = document.getElementById("tenantRows");

  if (!box) return;

  if (!schools.length) {

    box.innerHTML = `
      <tr>
        <td colspan="5">
          No schools found.
          Click Add School to create the first school.
        </td>
      </tr>
    `;

  } else {

    box.innerHTML = schools.map(t => `
      <tr>

        <td>
          <b>${esc(t.name)}</b>
          <small>${esc(t.code)}</small>
        </td>

        <td>
          ${esc(t.city || "—")}
        </td>

        <td>
          <span class="status">
            ${esc(t.status || "ACTIVE")}
          </span>
        </td>

        <td>
          ${esc(t.adminEmail || "—")}
        </td>

        <td>
          <button
            class="linkbtn"
            onclick="openTenant('${esc(t.id)}')">
            View
          </button>
        </td>

      </tr>
    `).join("");
  }

  const c = document.getElementById("schoolCount");

  if (c) {
    c.textContent = schools.length;
  }
}


/* =========================
   OPEN SCHOOL
   ========================= */

function openTenant(id) {

  location.href =
    "school-details.html?id=" +
    encodeURIComponent(id);
}


/* =========================
   OPEN ADD SCHOOL
   ========================= */

function openCreate() {

  location.href = "add-school.html";
}


/* =========================
   CREATE SCHOOL
   ========================= */

async function createSchool(e) {

  e.preventDefault();

  const f = e.target;

  const name =
    f.name.value.trim();

  const code =
    f.code.value.trim().toUpperCase();

  const city =
    f.city.value.trim();

  const adminName =
    f.adminName.value.trim();

  const adminEmail =
    f.adminEmail.value.trim().toLowerCase();


  /* REQUIRED VALIDATION */

  if (!name || !code || !adminEmail) {

    alert(
      "Please complete the required fields."
    );

    return;
  }


  /* DUPLICATE SCHOOL CODE CHECK */

  const existing =
    schools.some(
      x =>
        String(x.code || "").toUpperCase() === code
    );

  if (existing) {

    alert(
      "School code already exists."
    );

    return;
  }


  /* SCHOOL OBJECT */

  const school = {

    schoolId: newId(),

    name: name,

    code: code,

    city: city,

    status: "ACTIVE",

    adminName: adminName,

    adminEmail: adminEmail
  };


  const submit =
    f.querySelector(
      "button[type='submit']"
    );

  const oldText =
    submit
      ? submit.textContent
      : "";


  try {

    /* SHOW SAVING */

    if (submit) {

      submit.disabled = true;

      submit.textContent =
        "Saving...";
    }


    /* FIREBASE */

    const fb =
      await getFirebase();


    /* SAVE DIRECTLY TO FIRESTORE */

    const saved =
      await fb.createSchool(
        school
      );


    console.log(
      "School saved to Firestore:",
      saved
    );


    /* OPEN DETAILS */

    location.href =
      "school-details.html?id=" +
      encodeURIComponent(saved.id) +
      "&created=1";


  } catch (error) {

    console.error(
      "Firestore school save failed:",
      error
    );


    alert(
      "School could not be saved to Firebase Firestore.\n\n" +
      error.message
    );


    if (submit) {

      submit.disabled = false;

      submit.textContent =
        oldText;
    }
  }
}


/* =========================
   SCHOOL DETAILS
   ========================= */

async function renderDetails() {

  const id =
    new URLSearchParams(
      location.search
    ).get("id");


  const details =
    document.getElementById(
      "details"
    );


  if (!details) return;


  try {

    const fb =
      await getFirebase();


    /* GET FROM FIRESTORE */

    const t =
      await fb.getSchool(id);


    if (!t) {

      details.innerHTML = `
        <div class="card">
          <h2>School not found</h2>
        </div>
      `;

      return;
    }


    document.getElementById(
      "schoolName"
    ).textContent =
      t.name || "";


    document.getElementById(
      "schoolMeta"
    ).textContent =
      `${t.code || ""} • ${t.city || ""} • ${t.status || "ACTIVE"}`;


    const created =
      t.createdAt
        ? new Date(
            t.createdAt
          ).toLocaleDateString()
        : "—";


    details.innerHTML = `

      <div class="grid2">

        <div class="card">
          <div class="label">
            School Code
          </div>

          <strong>
            ${esc(t.code)}
          </strong>
        </div>


        <div class="card">
          <div class="label">
            Status
          </div>

          <strong>
            ${esc(t.status || "ACTIVE")}
          </strong>
        </div>


        <div class="card">
          <div class="label">
            Location
          </div>

          <strong>
            ${esc(t.city || "—")}
          </strong>
        </div>


        <div class="card">
          <div class="label">
            Created
          </div>

          <strong>
            ${esc(created)}
          </strong>
        </div>

      </div>


      <div class="card section">

        <h2>
          School Admin
        </h2>

        <p>

          <b>
            ${esc(
              t.adminName ||
              "School Admin"
            )}
          </b>

          <br>

          ${esc(
            t.adminEmail || "—"
          )}

        </p>

      </div>


      <div class="actions">

        <button
          class="btn"
          onclick="enterSchool('${esc(t.id)}')">
          Enter School
        </button>


        <button
          class="btn secondary"
          onclick="location.href='super-schools.html'">
          Back to Schools
        </button>

      </div>

    `;


  } catch (error) {

    console.error(
      "Firestore school details failed:",
      error
    );


    details.innerHTML = `
      <div class="card">

        <h2>
          Unable to load school
        </h2>

        <p>
          ${esc(error.message)}
        </p>

      </div>
    `;
  }
}


/* =========================
   ENTER SCHOOL
   ========================= */

async function enterSchool(id) {

  try {

    const fb =
      await getFirebase();


    const t =
      await fb.getSchool(id);


    if (!t) return;


    /*
      SessionStorage is only used for
      the currently selected school.

      School MASTER DATA remains in Firestore.
    */

    sessionStorage.setItem(
      "selectedSchool",
      JSON.stringify(t)
    );


    location.href =
      "dashboard.html";


  } catch (error) {

    console.error(
      "Unable to enter school:",
      error
    );


    alert(
      "Unable to open school.\n\n" +
      error.message
    );
  }
}


/* =========================
   HTML COMPATIBILITY
   ========================= */

window.loadSchools =
  loadSchools;

window.renderTenants =
  renderTenants;

window.openTenant =
  openTenant;

window.openCreate =
  openCreate;

window.createSchool =
  createSchool;

window.renderDetails =
  renderDetails;

window.enterSchool =
  enterSchool;


/* =========================
   AUTOMATIC PAGE INITIALISATION
   ========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (
      document.getElementById(
        "tenantRows"
      )
    ) {

      loadSchools();
    }


    if (
      document.getElementById(
        "details"
      )
    ) {

      renderDetails();
    }

  }
);
