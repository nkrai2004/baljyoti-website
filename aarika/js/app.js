/*
===========================================================
AARIKA Learning Operating System
Version : v0.1 Genesis
Author  : Project AARIKA
===========================================================
*/

"use strict";

import app from "../config/firebase-init.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

/*----------------------------------------------------------
 Application Configuration
----------------------------------------------------------*/

const AARIKA = {

    version: "0.1.0-genesis",

    environment: window.location.hostname === "localhost"
        ? "development"
        : "production",

    initialized: false

};

/*----------------------------------------------------------
 Firebase
----------------------------------------------------------*/

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/*----------------------------------------------------------
 Bootstrap
----------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});

/*----------------------------------------------------------
 Initialize Application
----------------------------------------------------------*/

function initializeApplication() {

    console.log(
        `%cAARIKA v${AARIKA.version}`,
        "color:#0F4C81;font-size:16px;font-weight:bold;"
    );

    console.log("Environment:", AARIKA.environment);

    setupNavigation();

    setupTheme();

    checkBrowser();

    loadConfiguration();

    initializeAuthentication();

    AARIKA.initialized = true;

    console.log("Application initialized.");

}

/*----------------------------------------------------------
 Authentication
----------------------------------------------------------*/

function initializeAuthentication() {

    const loginButton = document.getElementById("googleLogin");

    if (loginButton) {

        loginButton.addEventListener("click", async () => {

            try {

                await signInWithPopup(auth, provider);

            } catch (error) {

                console.error(error);

                alert("Login failed");

            }

        });

    }

    onAuthStateChanged(auth, (user) => {

        const oldCard = document.getElementById("userCard");

        if (oldCard) {

            oldCard.remove();

        }

        if (!user) return;

window.location.href = "student/";

        const hero = document.querySelector(".hero");

        hero.insertAdjacentHTML(
            "beforeend",
            `
            <div class="card" id="userCard" style="margin-top:30px;text-align:center;">

                <h3>Welcome ${user.displayName}</h3>

                <p>${user.email}</p>

                ${
                    user.photoURL
                    ? `<img
                        src="${user.photoURL}"
                        alt="Profile"
                        style="
                            width:90px;
                            height:90px;
                            border-radius:50%;
                            margin-top:15px;
                        ">`
                    : ""
                }

            </div>
            `
        );

    });

}

/*----------------------------------------------------------
 Navigation
----------------------------------------------------------*/

function setupNavigation() {

    const links = document.querySelectorAll("nav a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            console.log("Navigate:", link.textContent);

        });

    });

}

/*----------------------------------------------------------
 Theme
----------------------------------------------------------*/

function setupTheme() {

    document.documentElement.setAttribute(
        "data-theme",
        "light"
    );

}

/*----------------------------------------------------------
 Browser Check
----------------------------------------------------------*/

function checkBrowser() {

    if (!window.fetch) {

        alert("Your browser is not supported.");

    }

}

/*----------------------------------------------------------
 Configuration
----------------------------------------------------------*/

function loadConfiguration() {

    console.log("Loading configuration...");

}

/*----------------------------------------------------------
 Error Handler
----------------------------------------------------------*/

window.addEventListener("error", function(event){

    console.error("Application Error");

    console.error(event.message);

});
