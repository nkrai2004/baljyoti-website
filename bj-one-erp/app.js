/*=========================================================
BJ ONE ERP
File        : api.js
Version     : 1.0.1
=========================================================*/

"use strict";

const API = {

    async getDashboardData() {

        try {

            const response = await fetch(CONFIG.API_URL);

            if (!response.ok) {
                throw new Error("HTTP Status : " + response.status);
            }

            const data = await response.json();

            return data;

        } catch (error) {

            alert(
                "API ERROR\n\n" +
                error.name + "\n\n" +
                error.message
            );

            throw error;

        }

    }

};