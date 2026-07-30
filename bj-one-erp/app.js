/*=========================================================
BJ ONE ERP
File        : app.js
Version     : 3.0.0
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : Main Application Controller
=========================================================*/

"use strict";

const App = {

    version: "3.0.0",

    async start() {

        console.clear();

        console.log("====================================");
        console.log("BJ ONE ERP");
        console.log("Version :", this.version);
        console.log("====================================");

        if (!sessionStorage.getItem("google_token")) {

            alert("Please login first.");

            window.location.href = CONFIG.LOGIN_PAGE;

            return;

        }

        console.log("User authenticated.");

        this.loadUserProfile();

        await this.loadDashboard();

        await this.loadModules();

    },

    loadUserProfile() {

        const name =
            sessionStorage.getItem("user_name") || "User";

        const email =
            sessionStorage.getItem("user_email") || "";

        const role =
            sessionStorage.getItem("user_role") || "";

        const welcome =
            document.getElementById("welcomeUser");

        if (welcome) {

            welcome.innerHTML = `
                <strong>${name}</strong><br>
                <small>${email}</small><br>
                <small><b>Role :</b> ${role}</small>
            `;

        }

    },

    async loadDashboard() {

        try {

            console.log("Loading Dashboard...");

            const data = await API.getDashboard();

            if (!Array.isArray(data) || data.length < 2) {

                throw new Error("Invalid dashboard data.");

            }

            const dashboard = {};

            for (let i = 1; i < data.length; i++) {

                dashboard[data[i][0]] = data[i][1];

            }

            this.setValue(
                "students",
                dashboard.TotalStudents || 0
            );

            this.setValue(
                "staff",
                dashboard.TotalStaff || 0
            );

            this.setValue(
                "attendance",
                (dashboard.TodayAttendance || 0) + "%"
            );

            this.setValue(
                "fees",
                "₹" + (dashboard.FeeCollectionToday || 0)
            );

            console.log("Dashboard Loaded.");

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    },

    setValue(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent = value;

        }

    },
    
    async loadModules() {

        try {

            const role =
                sessionStorage.getItem("user_role");

            const result =
                await API.getRoleModules(role);

            if (!result.success) {

                throw new Error(result.message);

            }

            const menu =
                document.getElementById("sidebarMenu");

            menu.innerHTML = "";

            result.modules.forEach(module => {

                const li =
                    document.createElement("li");

                li.innerHTML = module.moduleName;

                li.onclick = function () {

                    if (module.url) {

                        window.location.href = module.url;

                    }

                };

                menu.appendChild(li);

            });

            console.log(
                result.modules.length +
                " modules loaded."
            );

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to load modules.\n\n" +
                error.message
            );

        }

    },

    logout() {

        sessionStorage.clear();

        if (typeof Auth !== "undefined") {

            Auth.logout();

        }

        else {

            window.location.href =
                CONFIG.LOGIN_PAGE;

        }

    }

};

window.addEventListener(
    "DOMContentLoaded",
    function () {

        App.start();

    }
);
