/*
=========================================================
BJ ONE ERP
File        : auth.js
Version     : 4.0.0
Description : Authentication Module
=========================================================
*/

"use strict";

const Auth = {

    init() {

        if (typeof google === "undefined") {
            console.error("Google Identity Services not loaded.");
            return;
        }

        google.accounts.id.initialize({
            client_id: CONFIG.GOOGLE_CLIENT_ID,
            callback: Auth.handleCredentialResponse
        });

        const btn = document.getElementById("googleSignIn");

        if (btn) {

            google.accounts.id.renderButton(btn, {
                theme: "outline",
                size: "large",
                width: 300
            });

        }

    },

    async handleCredentialResponse(response) {

        try {

            const result = await API.login(response.credential);

            if (!result.success) {

                alert(result.message || "Login failed.");

                return;

            }

            sessionStorage.setItem(
                CONFIG.STORAGE.TOKEN,
                response.credential
            );

            sessionStorage.setItem(
                CONFIG.STORAGE.USER_NAME,
                result.user.name
            );

            sessionStorage.setItem(
                CONFIG.STORAGE.USER_EMAIL,
                result.user.email
            );

            sessionStorage.setItem(
                CONFIG.STORAGE.USER_ROLE,
                result.user.role
            );

            window.location.href =
                CONFIG.DASHBOARD_PAGE;

        }

        catch (e) {

            console.error(e);

            alert("Unable to login.");

        }

    },

    isLoggedIn() {

        return sessionStorage.getItem(
            CONFIG.STORAGE.TOKEN
        ) !== null;

    },

    getUser() {

        return {

            name: sessionStorage.getItem(
                CONFIG.STORAGE.USER_NAME
            ),

            email: sessionStorage.getItem(
                CONFIG.STORAGE.USER_EMAIL
            ),

            role: sessionStorage.getItem(
                CONFIG.STORAGE.USER_ROLE
            )

        };

    },

    requireLogin() {

        if (!this.isLoggedIn()) {

            window.location.href =
                CONFIG.LOGIN_PAGE;

        }

    },

    logout() {

        sessionStorage.removeItem(
            CONFIG.STORAGE.TOKEN
        );

        sessionStorage.removeItem(
            CONFIG.STORAGE.USER_NAME
        );

        sessionStorage.removeItem(
            CONFIG.STORAGE.USER_EMAIL
        );

        sessionStorage.removeItem(
            CONFIG.STORAGE.USER_ROLE
        );

        window.location.href =
            CONFIG.LOGIN_PAGE;

    }

};

window.addEventListener("load", function () {

    if (document.getElementById("googleSignIn")) {

        Auth.init();

    }

});
