/*
=========================================================
BJ ONE ERP
File : auth.js
Version : 5.0
=========================================================
*/

"use strict";

const Auth = {

    init() {

        google.accounts.id.initialize({

            client_id: CONFIG.GOOGLE_CLIENT_ID,

            callback: this.handleCredentialResponse.bind(this)

        });

        google.accounts.id.renderButton(

            document.getElementById("googleSignIn"),

            {
                theme: "outline",
                size: "large",
                width: 300
            }

        );

    },

    async handleCredentialResponse(response) {

        try {

            // Decode Google JWT
            const payload = JSON.parse(
                atob(response.credential.split(".")[1])
            );

            const email = payload.email;
            const name = payload.name;

            console.log("Google User :", email);

            // Authenticate with Apps Script
            const result = await API.login(email);

            if (!result.success) {

                alert(result.message);

                return;

            }

            sessionStorage.setItem(
                CONFIG.STORAGE.TOKEN,
                response.credential
            );

            sessionStorage.setItem(
                CONFIG.STORAGE.USER_EMAIL,
                email
            );

            sessionStorage.setItem(
                CONFIG.STORAGE.USER_NAME,
                result.user.name || name
            );

            sessionStorage.setItem(
                CONFIG.STORAGE.USER_ROLE,
                result.user.role
            );

            window.location.href =
                CONFIG.DASHBOARD_PAGE;

        }

        catch (error) {

            console.error(error);

            alert("Login failed.");

        }

    },

    logout() {

        sessionStorage.clear();

        window.location.href =
            CONFIG.LOGIN_PAGE;

    }

};

window.onload = function () {

    Auth.init();

};
