/*=========================================================
BJ ONE ERP
File        : app.js
Version     : 1.1.0
Date        : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : Main Application Controller
=========================================================*/

"use strict";

const App = {

    version: "1.1.0",

    async start() {

        console.log("====================================");
        console.log(CONFIG.APP_NAME);
        console.log("Version :", this.version);
        console.log("====================================");

        // Check Login
        if (!sessionStorage.getItem("google_token")) {

            alert("Please login first.");

            window.location.href = CONFIG.LOGIN_PAGE;

            return;

        }

        console.log("User authenticated.");
        const name = sessionStorage.getItem("user_name");

const welcome = document.getElementById("welcomeUser");

if (welcome && name) {

    welcome.textContent = "Welcome, " + name;

}

        await this.loadDashboard();

    },

    async loadDashboard() {

        try {

            console.log("Loading dashboard...");

            const data = await API.getDashboardData();

            if (!Array.isArray(data) || data.length < 2) {

                throw new Error("Invalid dashboard data received from server.");

            }

            console.log("Dashboard Data:");
            console.table(data);

            const dashboard = {};

            for (let i = 1; i < data.length; i++) {

                dashboard[data[i][0]] = data[i][1];

            }

            this.setValue("students", dashboard.TotalStudents);
            this.setValue("staff", dashboard.TotalStaff);
            this.setValue("attendance", dashboard.TodayAttendance + "%");
            this.setValue("fees", "₹" + dashboard.FeeCollectionToday);

            console.log("Dashboard loaded successfully.");

        }

        catch (error) {

            console.error("Dashboard Error:", error);

            alert(
                "Dashboard Loading Failed\n\n" +
                error.message
            );

        }

    },

    setValue(id, value) {

        const element = document.getElementById(id);

        if (!element) {

            console.warn("Element not found:", id);

            return;

        }

        element.textContent = value;

    },

    logout() {

        sessionStorage.clear();

        if (typeof Auth !== "undefined") {

            Auth.logout();

        } else {

            window.location.href = CONFIG.LOGIN_PAGE;

        }

    }

};

window.addEventListener("DOMContentLoaded", function () {

    App.start();

});
