/*=========================================================
BJ ONE ERP
File        : auth.js
Version     : 1.0.0
Date        : 27 July 2026
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
            callback: Auth.handleCredentialResponse
        });

        Auth.initialized = true;

        console.log("Authentication Initialized Successfully.");

    },

    handleCredentialResponse(response) {

        console.log("Google Authentication Successful");

        console.log(response);

        // Step 2:
        // We will send response.credential
        // to Google Apps Script for verification.

    }

};

window.addEventListener("load", () => {

    Auth.init();

});
