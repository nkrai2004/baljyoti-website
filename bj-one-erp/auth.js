/*
=========================================================
BJ ONE ERP
File        : auth.js
Version     : 2.0.0
Date        : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : Google Authentication Manager
=========================================================
*/

"use strict";

const Auth = {

    initialized: false,

    init: function () {

        // Check configuration
        if (typeof CONFIG === "undefined") {

            alert("CONFIG not found. Please check config.js");

            return;

        }

        // Wait until Google library is available
        let attempts = 0;

        const timer = setInterval(function () {

            attempts++;

            if (
                typeof google !== "undefined" &&
                google.accounts &&
                google.accounts.id
            ) {

                clearInterval(timer);

                google.accounts.id.initialize({

                    client_id: CONFIG.GOOGLE_CLIENT_ID,

                    callback: Auth.handleCredentialResponse

                });

                Auth.initialized = true;

                console.log("Google Sign-In initialized.");

            }

            if (attempts > 50) {

                clearInterval(timer);

                alert("Google Sign-In library could not be loaded.");

            }

        }, 200);

    },

    handleCredentialResponse: function (response) {

        if (!response || !response.credential) {

            alert("Login failed.");

            return;

        }

        sessionStorage.setItem(
            "google_token",
            response.credential
        );

        window.location.href = CONFIG.DASHBOARD_PAGE;

    },

    isLoggedIn: function () {

        return sessionStorage.getItem("google_token") !== null;

    },

    logout: function () {

        sessionStorage.removeItem("google_token");

        if (
            typeof google !== "undefined" &&
            google.accounts &&
            google.accounts.id
        ) {

            google.accounts.id.disableAutoSelect();

        }

        window.location.href = CONFIG.LOGIN_PAGE;

    }

};

// Only initialize on the login page
window.addEventListener("load", function () {

    if (document.getElementById("googleButton")) {

        Auth.init();

    }

});
