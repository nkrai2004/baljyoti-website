/*
=========================================================
BJ ONE ERP
File        : config.js
Version     : 2.1.0
Date         : 28 July 2026
Author      : Nishant Rai & ChatGPT
Description : Global Configuration
=========================================================
*/

"use strict";

const CONFIG = {

    // ==========================================
    // APPLICATION
    // ==========================================

    APP_NAME: "BJ ONE ERP",

    APP_VERSION: "2.1.0",

    APP_URL: "https://baljyoti.com/bj-one-erp/",

    // ==========================================
    // SCHOOL
    // ==========================================

    SCHOOL_NAME: "Bal Jyoti Public School",

    SCHOOL_LOGO: "https://baljyoti.com/logo.png",

    // ==========================================
    // GOOGLE SIGN-IN
    // ==========================================

    GOOGLE_CLIENT_ID:
        "594079296208-rrfpja5335vp8cv9vt8fnofub0au20pb.apps.googleusercontent.com",

    ALLOWED_DOMAIN:
        "baljyoti.com",

    // ==========================================
    // GOOGLE APPS SCRIPT WEB APP
    // ==========================================

    API_URL:
        "https://script.google.com/macros/s/AKfycbwDZFT3qHy0upPtqCyB0krbXFV25f_kYwAoBhQTyfuAcBe4whpl9xkZqeCavzUZ5eCt/exec",

    // Example:
    // "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec"

    // ==========================================
    // PAGES
    // ==========================================

    LOGIN_PAGE:
        "login.html",

    DASHBOARD_PAGE:
        "dashboard.html"

};

Object.freeze(CONFIG);

console.log("==================================");
console.log(CONFIG.APP_NAME);
console.log("Version : " + CONFIG.APP_VERSION);
console.log("Configuration Loaded Successfully");
console.log("==================================");
