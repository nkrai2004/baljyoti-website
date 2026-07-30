/*=========================================================
BJ ONE ERP
File        : admission.js
Version     : 1.0.0
Date         : 30 July 2026
Author       : Nishant Rai & ChatGPT
Description  : Admission CRM Dashboard
=========================================================*/

document.addEventListener("DOMContentLoaded", initAdmission);

/*=========================================================
 INITIALIZE
=========================================================*/
async function initAdmission() {

    try {

        checkLogin();

        await checkPermission();

        await loadAdmissionLeads();

        bindEvents();

    } catch (err) {

        console.error(err);

        alert(err.message);

        window.location.href = "../dashboard.html";

    }

}

/*=========================================================
 LOGIN CHECK
=========================================================*/
function checkLogin() {

    const token = sessionStorage.getItem("google_token");

    if (!user) {

        alert("Session expired. Please login again.");

        window.location.href = "../index.html";

        return;

    }

    window.currentUser = user;

}

/*=========================================================
 PERMISSION CHECK
=========================================================*/
async function checkPermission() {

    const response = await API.getRoleModules(window.currentUser.role);

    if (!response.success) {

        throw new Error("Unable to verify permissions.");

    }

    const allowed = response.modules.some(function (m) {

        return String(m.moduleId).toUpperCase() === "ADMISSION";

    });

    if (!allowed) {

        throw new Error("Access denied.");

    }

}

/*=========================================================
 LOAD ADMISSION LEADS
=========================================================*/
async function loadAdmissionLeads() {

    const response = await API.get("admissionLeads");

    if (!Array.isArray(response)) {

        return;

    }

    updateDashboard(response);

    renderLeadTable(response);

}

/*=========================================================
 DASHBOARD
=========================================================*/
function updateDashboard(data) {

    const total = Math.max(data.length - 1, 0);

    document.getElementById("todayLeads").innerText = total;

    document.getElementById("todayFollowup").innerText = 0;

    document.getElementById("walkins").innerText = 0;

    document.getElementById("applications").innerText = 0;

    document.getElementById("admissions").innerText = 0;

    document.getElementById("documents").innerText = 0;

}

/*=========================================================
 LEAD TABLE
=========================================================*/
function renderLeadTable(data) {

    const tbody = document.getElementById("leadTable");

    tbody.innerHTML = "";

    if (data.length <= 1) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">No Leads Available</td>
            </tr>
        `;

        return;

    }

    for (let i = 1; i < data.length; i++) {

        const row = data[i];

        tbody.innerHTML += `

        <tr>

            <td>${row[0] || ""}</td>

            <td>${row[4] || ""}</td>

            <td>${row[7] || ""}</td>

            <td>${row[18] || ""}</td>

            <td>${row[19] || ""}</td>

        </tr>

        `;

    }

}

/*=========================================================
 BUTTON EVENTS
=========================================================*/
function bindEvents() {

    document
        .getElementById("newLeadBtn")
        .addEventListener("click", function () {

            alert("New Lead module will be added in next step.");

        });

    document
        .getElementById("walkinBtn")
        .addEventListener("click", function () {

            alert("Walk-in module will be added in next step.");

        });

}
