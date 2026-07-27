/*=========================================================
BJ ONE ERP
File        : app.js
Version     : 1.0.0
Date        : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : Main Application Controller
=========================================================*/

"use strict";

const App = {

    version: "1.0.0",

    async start() {

        console.log("==================================");
        console.log("BJ ONE ERP");
        console.log("Version : " + this.version);
        console.log("==================================");

        // Check login
        const token = sessionStorage.getItem("google_token");

        if (!token) {

            alert("Please login first.");

            window.location.href = "login.html";

            return;

        }

        console.log("User authenticated.");

        // Load Dashboard
        await this.loadDashboard();

    },

    async loadDashboard() {

        try {

            const data = await API.getDashboardData();

            if (!data) {

                alert("No dashboard data received.");

                return;

            }

            let dashboard = {};

            for (let i = 1; i < data.length; i++) {

                dashboard[data[i][0]] = data[i][1];

            }

            this.setValue("students", dashboard.TotalStudents);
            this.setValue("staff", dashboard.TotalStaff);
            this.setValue("attendance", dashboard.TodayAttendance + "%");
            this.setValue("fees", "₹" + dashboard.FeeCollectionToday);

            console.log("Dashboard Loaded Successfully.");

        }
        catch (error) {

            console.error(error);

            alert("Dashboard Loading Failed");

        }

    },

    setValue(id, value) {

        const element = document.getElementById(id);

        if (element) {

            element.innerHTML = value;

        }

    },

    logout() {

        sessionStorage.clear();

        window.location.href = "login.html";

    }

};

window.addEventListener("load", function () {

    App.start();

});