/*
=========================================================
BJ ONE ERP
File        : api.js
Version     : 4.0.0
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : API Communication Layer
=========================================================
*/

"use strict";

const API = {

    baseUrl: CONFIG.API_URL,

    async request(action, data = {}) {

        try {

            const params = new URLSearchParams();

            params.append("action", action);

            Object.keys(data).forEach(function (key) {

                if (
                    data[key] !== undefined &&
                    data[key] !== null
                ) {

                    params.append(key, data[key]);

                }

            });

            const url =
                API.baseUrl + "?" + params.toString();

            console.log("GET :", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );

            }

            const json = await response.json();

            return json;

        } catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message

            };

        }

    },

    async post(action, data = {}) {

        try {

            const formData = new FormData();

            formData.append("action", action);

            Object.keys(data).forEach(function (key) {

                formData.append(key, data[key]);

            });

            const response = await fetch(API.baseUrl, {

                method: "POST",

                body: formData

            });

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );

            }

            const json = await response.json();

            return json;

        } catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message

            };

        }

    },

    async login(email) {

        return await API.request(

            "login",

            {

                email: email

            }

        );

    },

    async dashboard() {

        return await API.request(

            "dashboard"

        );

    },

    async getLeadSources() {

        return await API.request(

            "leadSources"

        );

    },

    async saveAdmission(data) {

        return await API.post(

            "saveAdmission",

            data

        );

    },

    async listAdmissions() {

        return await API.request(

            "listAdmissions"

        );

    },

    async dashboardStats() {

        return await API.request(

            "dashboardStats"

        );

    }

};

console.log("API Engine Loaded");
