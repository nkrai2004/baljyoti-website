
/*=========================================================
BJ ONE ERP
File        : api.js
Version     : 1.0.0
Date        : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : API Communication Module
=========================================================*/

"use strict";

const API = {

    async getDashboardData() {

        try {

            console.log("Connecting to API...");
            console.log(CONFIG.API_URL);

            const response = await fetch(CONFIG.API_URL);

            if (!response.ok) {
                throw new Error("Unable to connect to API.");
            }

            const data = await response.json();

            console.log("Dashboard Data Received");

            console.log(data);

            return data;

        }
        catch (error) {

            console.error("API Error :", error);

            alert("Unable to load dashboard data.");

            return null;

        }

    }

};
