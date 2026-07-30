/*
=========================================================
BJ ONE ERP
File        : config.js
Version     : 4.0.0
Description : Global Configuration
=========================================================
*/

"use strict";

const CONFIG = {

    // ==========================================
    // GOOGLE APPS SCRIPT WEB APP URL
    // ==========================================
    API_URL:
        "https://script.google.com/macros/s/AKfycbwDZFT3qHy0upPtqCyB0krbXFV25f_kYwAoBhQTyfuAcBe4whpl9xkZqeCavzUZ5eCt/exec",

    // ==========================================
    // GOOGLE CLIENT ID
    // ==========================================
    GOOGLE_CLIENT_ID:
        "594079296208-rrfpja5335vp8cv9vt8fnofub0au20pb.apps.googleusercontent.com",

    // ==========================================
    // APPLICATION
    // ==========================================
    APP_NAME: "BJ ONE ERP",

    APP_VERSION: "4.0.0",

    SCHOOL_NAME: "Bal Jyoti Public School",

    // ==========================================
    // PAGES
    // ==========================================
    LOGIN_PAGE: "login.html",

    DASHBOARD_PAGE: "dashboard.html",

    // ==========================================
    // SESSION STORAGE KEYS
    // ==========================================
    STORAGE: {

        TOKEN: "google_token",

        USER_NAME: "user_name",

        USER_EMAIL: "user_email",

        USER_ROLE: "user_role"

    },

    // ==========================================
    // DEFAULT SETTINGS
    // ==========================================
    DEFAULT_ROLE: "Viewer",

    DEFAULT_TIMEOUT: 30000,

    DATE_FORMAT: "DD-MM-YYYY",

    CURRENCY: "INR",

    LANGUAGE: "en-IN",

    DEBUG: true

};

// Prevent accidental modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.STORAGE);

console.log(
    CONFIG.APP_NAME +
    " v" +
    CONFIG.APP_VERSION +
    " loaded successfully."
);
