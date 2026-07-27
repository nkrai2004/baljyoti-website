/*=========================================================
BJ ONE ERP
File        : api.js
Version     : 1.1.0
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

            const response = await fetch(CONFIG.API_URL, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            console.log("HTTP Status:", response.status);

            if (!response.ok) {
                throw new Error("HTTP Status: " + response.status);
            }

            const text = await response.text();

            console.log("Raw Response:");
            console.log(text);

            let data;

            try {

                data = JSON.parse(text);

            } catch (e) {

                throw new Error("Server did not return valid JSON.\n\nResponse:\n" + text);

            }

            return data;

        } catch (error) {

            console.error(error);

            alert(
                "API ERROR\n\n" +
                error.message
            );

            throw error;

        }

    }

};