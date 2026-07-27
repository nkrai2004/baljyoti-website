/*=========================================================
BJ ONE ERP
File        : auth.js
Version     : 1.2.0
Date        : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : Google Authentication Module
=========================================================*/

"use strict";

const Auth = {

    initialized: false,

    init() {

        console.log("====================================");
        console.log("BJ ONE ERP Authentication");
        console.log("====================================");

        if (typeof CONFIG === "undefined") {

            console.error("CONFIG not found.");

            alert("Configuration file not loaded.");

            return;

        }

        if (typeof google === "undefined" || !google.accounts || !google.accounts.id) {

            console.error("Google Identity Services library not loaded.");

            alert("Google Sign-In library could not be loaded.");

            return;

        }

        google.accounts.id.initialize({

            client_id: CONFIG.GOOGLE_CLIENT_ID,

            callback: this.handleCredentialResponse.bind(this)

        });

        this.initialized = true;

        console.log("Authentication initialized successfully.");

    },

    handleCredentialResponse(response) {

        try {

            console.log("Google Authentication Successful");

            if (!response || !response.credential) {

                alert("Authentication failed. No credential received.");

                return;

            }

            // Store Google ID Token
            sessionStorage.setItem("google_token", response.credential);

            console.log("Google token stored successfully.");

            // Redirect to dashboard
            window.location.href = CONFIG.DASHBOARD_PAGE;

        }
        catch (error) {

            console.error("Authentication Error:", error);

            alert("Login failed.\n\n" + error.message);

        }

    },

    isLoggedIn() {

        return sessionStorage.getItem("google_token") !== null;

    },

    logout() {

        sessionStorage.clear();

        if (typeof google !== "undefined" &&
            google.accounts &&
            google.accounts.id) {

            google.accounts.id.disableAutoSelect();

        }

        window.location.href = CONFIG.LOGIN_PAGE;

    }

};

window.addEventListener("load", function () {

    Auth.init();

});