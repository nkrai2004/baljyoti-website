/*
=========================================================
BJ ONE ERP
api.js
Version 5.0
=========================================================
*/

"use strict";

const API = {

    baseURL: CONFIG.API_URL,

    async get(action, params = {}) {

        const url = new URL(this.baseURL);

        url.searchParams.append("action", action);

        Object.keys(params).forEach(key => {

            url.searchParams.append(key, params[key]);

        });

        try {

            const response = await fetch(url);

            return await response.json();

        }

        catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message

            };

        }

    },

    login(email) {

        return this.get("login", {

            email: email

        });

    },

    dashboard() {

        return this.get("dashboard");

    },

    modules(role) {

        return this.get("roleModules", {

            role: role

        });

    },

    users() {

        return this.get("users");

    },

    roles() {

        return this.get("roles");

    },

    config() {

        return this.get("config");

    },

    admissionLeads() {

        return this.get("admissionLeads");

    }

};
