/*
=========================================================
BJ ONE ERP
File        : auth.js
Version     : 3.0.0
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : Google Authentication Manager
=========================================================
*/

"use strict";

const Auth = {

    initialized: false,

    init: function () {

        if (typeof CONFIG === "undefined") {
            alert("CONFIG not found.");
            return;
        }

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

                console.log("Google Sign-In Ready");

            }

            if (attempts > 50) {

                clearInterval(timer);

                alert("Unable to load Google Sign-In.");

            }

        }, 200);

    },

    handleCredentialResponse: async function (response) {

        if (!response || !response.credential) {

            alert("Google Login Failed.");

            return;

        }

        const token = response.credential;

        const payload = JSON.parse(atob(token.split(".")[1]));

        const email = (payload.email || "").toLowerCase();

        try {

            const url =
                CONFIG.API_URL +
                "?action=login&email=" +
                encodeURIComponent(email);

            const result = await fetch(url);

            const data = await result.json();

            if (!data.success) {

                alert(data.message);

                return;

            }

            sessionStorage.setItem("google_token", token);
            sessionStorage.setItem("user_name", data.user.name);
            sessionStorage.setItem("user_email", data.user.email);
            sessionStorage.setItem("user_role", data.user.role);

            window.location.href = CONFIG.DASHBOARD_PAGE;

        } catch (err) {

            console.error(err);

            alert("Unable to connect to BJ ONE ERP Server.");

        }

    },

    isLoggedIn: function () {

        return sessionStorage.getItem("google_token") !== null;

    },

    logout: function () {

        sessionStorage.clear();

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

window.addEventListener("load", function () {

    if (document.getElementById("googleButton")) {

        Auth.init();

    }

});
