/*=========================================================
BJ ONE ERP
File        : api.js
Version     : 3.0.0
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : ERP API Manager
=========================================================*/

"use strict";

const API = {

    /*=====================================================
      COMMON GET METHOD
    =====================================================*/
    async get(action = "dashboard", params = {}) {

        try {

            let url = CONFIG.API_URL + "?action=" + encodeURIComponent(action);

            for (const key in params) {

                url += "&" +
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(params[key]);

            }

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

    /*=====================================================
      DASHBOARD
    =====================================================*/
    async getDashboard() {

        return await this.get("dashboard");

    },

    /*=====================================================
      USERS
    =====================================================*/
    async getUsers() {

        return await this.get("users");

    },

    /*=====================================================
      ROLES
    =====================================================*/
    async getRoles() {

        return await this.get("roles");

    },

    /*=====================================================
      MODULES
    =====================================================*/
    async getModules() {

        return await this.get("modules");

    },

    /*=====================================================
      ROLE MODULES
    =====================================================*/
    async getRoleModules(role) {

        return await this.get("roleModules", {
            role: role
        });

    },

    /*=====================================================
      CONFIG
    =====================================================*/
    async getConfig() {

        return await this.get("config");

    }

};
