/*=========================================================
BJ ONE ERP
File        : app.js
Version     : 2.0.0
Date        : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : Main Application Controller
=========================================================*/

"use strict";

const App = {

    version: "2.0.0",

    async start() {

        console.clear();

        console.log("====================================");
        console.log("BJ ONE ERP");
        console.log("Version :", this.version);
        console.log("====================================");

        // Check Login
        if (!sessionStorage.getItem("google_token")) {

            alert("Please login first.");

            window.location.href = CONFIG.LOGIN_PAGE;

            return;

        }

        console.log("User authenticated.");

        this.loadUserProfile();

        await this.loadDashboard();

        // Future Step
        // await this.loadModules();

    },

    loadUserProfile() {

        const name = sessionStorage.getItem("user_name") || "User";

        const email = sessionStorage.getItem("user_email") || "";

        const welcome = document.getElementById("welcomeUser");

        if (welcome) {

            welcome.innerHTML = `
                <strong>${name}</strong><br>
                <small>${email}</small>
            `;

        }

    },

    async loadDashboard() {

        try {

            console.log("Loading dashboard...");

            const data = await API.getDashboard();

            if (!Array.isArray(data) || data.length < 2) {

                throw new Error("Invalid dashboard data received.");

            }

            console.table(data);

            const dashboard = {};

            for (let i = 1; i < data.length; i++) {

                dashboard[data[i][0]] = data[i][1];

            }

            this.setValue("students", dashboard.TotalStudents || 0);
            this.setValue("staff", dashboard.TotalStaff || 0);
            this.setValue("attendance", (dashboard.TodayAttendance || 0) + "%");
            this.setValue("fees", "₹" + (dashboard.FeeCollectionToday || 0));

            console.log("Dashboard loaded successfully.");

        }

        catch (error) {

            console.error(error);

            alert(
                "Dashboard Loading Failed\n\n" +
                error.message
            );

        }

    },

    setValue(id, value) {

        const element = document.getElementById(id);

        if (element) {

            element.textContent = value;

        }

    },

    async loadModules() {

        try {

            const data = await API.getModules();

            console.table(data);

            // Dynamic Sidebar will be added in next step.

        }

        catch (error) {

            console.error(error);

        }

    },

    logout() {

        sessionStorage.clear();

        if (typeof Auth !== "undefined") {

            Auth.logout();

        }

        else {

            window.location.href = CONFIG.LOGIN_PAGE;

        }

    }

};

window.addEventListener("DOMContentLoaded", function () {

    App.start();

});
