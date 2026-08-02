/*
===========================================================
AARIKA Learning Operating System
Version : v0.1 Genesis
Author  : Project AARIKA
===========================================================
*/
import app from "../config/firebase-init.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
"use strict";

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

    AARIKA.initialized = true;

    console.log("Application initialized.");

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

        alert(
            "Your browser is not supported."
        );

    }

}

/*----------------------------------------------------------
 Configuration
----------------------------------------------------------*/

function loadConfiguration() {

    console.log("Loading configuration...");

    /*
        Future

        Firebase Config
        Feature Flags
        Remote Config
        API Endpoints

    */

}

/*----------------------------------------------------------
 Error Handler
----------------------------------------------------------*/

window.addEventListener("error", function(event){

    console.error("Application Error");

    console.error(event.message);

});
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const loginButton = document.getElementById("googleLogin");

if (loginButton) {

    loginButton.addEventListener("click", async () => {

        try {

            const result = await signInWithPopup(auth, provider);

          const hero = document.querySelector(".hero");

hero.insertAdjacentHTML(
    "beforeend",
    `
    <div class="card" style="margin-top:30px;">
        <h3>Welcome ${result.user.displayName}</h3>
        <p>${result.user.email}</p>
        <img
            src="${result.user.photoURL}"
            alt="Profile"
            style="
                width:90px;
                border-radius:50%;
                margin-top:15px;
            ">
    </div>
    `
);

            console.log(result.user);

        } catch (error) {

            console.error(error);

            alert("Login failed");

        }

    });

}

/*----------------------------------------------------------
 Future Modules

Student
Parent
Teacher
Admin

Firebase

Authentication

ATHENA

MEMORIA

LGI

AIRA

----------------------------------------------------------*/
