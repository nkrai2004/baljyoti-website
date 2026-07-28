/*=========================================================
BJ ONE ERP
File        : api.js
Version     : 2.0.0
Date         : 28 July 2026
Author       : Nishant Rai & ChatGPT
Description  : ERP API Manager
=========================================================*/

"use strict";

const API = {

    async get(action = "dashboard") {

        try {

            const url = CONFIG.API_URL + "?action=" + action;

            console.log("API Request :", url);

            const response = await fetch(url, {
                method: "GET",
                redirect: "follow"
            });

            if (!response.ok) {

                throw new Error("HTTP Status : " + response.status);

            }

            return await response.json();

        }

        catch (error) {

            console.error(error);

            alert("API Error\n\n" + error.message);

            throw error;

        }

    },

    async getDashboard() {

        return await this.get("dashboard");

    },

    async getUsers() {

        return await this.get("users");

    },

    async getRoles() {

        return await this.get("roles");

    },

    async getModules() {

        return await this.get("modules");

    },

    async getConfig() {

        return await this.get("config");

    }

};
