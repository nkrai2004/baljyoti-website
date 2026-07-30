/*=========================================================
BJ ONE ERP
File        : admission.js
Version     : 2.0.0
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : Admission CRM Dashboard
=========================================================*/

"use strict";

document.addEventListener("DOMContentLoaded", initAdmission);

let currentUser = null;

/*=========================================================
 INITIALIZE
=========================================================*/
async function initAdmission() {

    try {

        checkLogin();

        await checkPermission();

        await loadAdmissionLeads();

        bindEvents();

        console.log("Admission Module Loaded Successfully");

    } catch (err) {

        console.error(err);

        alert(err.message);

        // Keep the page here while debugging.
        // window.location.href = "../dashboard.html";

    }

}

/*=========================================================
 LOGIN
=========================================================*/
function checkLogin() {

    const token = sessionStorage.getItem("google_token");

    if (!token) {

        throw new Error("Session expired. Please login again.");

    }

    currentUser = {

        name: sessionStorage.getItem("user_name") || "",

        email: sessionStorage.getItem("user_email") || "",

        role: sessionStorage.getItem("user_role") || ""

    };

    console.log("Current User :", currentUser);

}

/*=========================================================
 PERMISSION
=========================================================*/
async function checkPermission() {

    if (!currentUser) {

        throw new Error("Current user not available.");

    }

    if (!currentUser.role) {

        throw new Error("User role missing.");

    }

    const response = await API.getRoleModules(currentUser.role);

    console.log("Role Module Response :", response);

    if (!response.success) {

        throw new Error("Unable to verify permissions.");

    }

    const allowed = response.modules.some(function (m) {

        return String(m.moduleId).toUpperCase() === "ADMISSION";

    });

    if (!allowed) {

        throw new Error("Access denied for Admission Module.");

    }

}

/*=========================================================
 LOAD LEADS
=========================================================*/
async function loadAdmissionLeads() {

    const response = await API.getAdmissionLeads();

    console.log("Admission Leads :", response);

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

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    };

    set("todayLeads", total);
    set("todayFollowup", 0);
    set("walkins", 0);
    set("applications", 0);
    set("admissions", 0);
    set("documents", 0);

}

/*=========================================================
 TABLE
=========================================================*/
function renderLeadTable(data) {

    const tbody = document.getElementById("leadTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length <= 1) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">No Leads Found</td>
            </tr>`;

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
            </tr>`;
    }

}

/*=========================================================
 EVENTS
=========================================================*/
function bindEvents() {

    const newLeadBtn = document.getElementById("newLeadBtn");

    if (newLeadBtn) {

        newLeadBtn.addEventListener("click", function () {

            alert("New Lead Module - Coming Next");

        });

    }

    const walkinBtn = document.getElementById("walkinBtn");

    if (walkinBtn) {

        walkinBtn.addEventListener("click", function () {

            alert("Walk-in Module - Coming Next");

        });

    }

}
