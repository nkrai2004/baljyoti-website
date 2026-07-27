/*=========================================================
BJ ONE ERP
File        : auth.js
Version     : 1.1.0
Date        : 27 July 2026
Author      : Nishant Rai & ChatGPT
Description : Google Authentication Module
=========================================================*/

"use strict";

const Auth = {

    initialized: false,

    init() {

        console.log("Initializing Authentication...");

        if (typeof google === "undefined") {
            console.error("Google Identity Services library not loaded.");
            return;
        }

        google.accounts.id.initialize({

            client_id: CONFIG.GOOGLE_CLIENT_ID,

            callback: this.handleCredentialResponse.bind(this)

        });

        this.initialized = true;

        console.log("Authentication Initialized Successfully.");

    },

    handleCredentialResponse(response) {

        try {

            console.log("Google Authentication Successful");

            console.log(response);

            if (!response.credential) {

                alert("Authentication failed.");

                return;

            }

            // Store Google ID Token temporarily
            sessionStorage.setItem("google_token", response.credential);

            console.log("Token stored successfully.");

            console.log("Redirecting to dashboard...");

            window.location.href = "dashboard.html";

        }
        catch (error) {

            console.error(error);

            alert("Login failed.");

        }

    },

    logout() {

        sessionStorage.clear();

        google.accounts.id.disableAutoSelect();

        window.location.href = "login.html";

    }

};

window.addEventListener("load", function () {

    Auth.init();

});
