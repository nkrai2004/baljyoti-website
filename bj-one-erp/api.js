/*=========================================================
BJ ONE ERP
File        : api.js
Version     : 3.1.0
Date        : 30 July 2026
Description : ERP API Manager
=========================================================*/

"use strict";

const API = {

    async get(action = "dashboard", params = {}) {

        let url = CONFIG.API_URL + "?action=" + encodeURIComponent(action);

        Object.keys(params).forEach(key => {
            url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        });

        console.log("API:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        return await response.json();

    },

    getDashboard() {
        return this.get("dashboard");
    },

    getUsers() {
        return this.get("users");
    },

    getRoles() {
        return this.get("roles");
    },

    getModules() {
        return this.get("modules");
    },

    getRoleModules(role) {
        return this.get("roleModules", {
            role: role
        });
    },

    /* ---------- ADMISSION ---------- */

    getAdmissionLeads() {
        return this.get("admissionLeads");
    },

    getLeadSources() {
        return this.get("leadSources");
    },

    saveAdmissionLead(data) {
        return this.get("saveAdmissionLead", data);
    },

    getConfig() {
        return this.get("config");
    }

};
