/*
=========================================================
BJ ONE ERP
File        : config.js
Version     : 4.0.1
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : Global Configuration
=========================================================
*/

"use strict";

const CONFIG = {

    // School Information
    SCHOOL_NAME: "Bal Jyoti Public School",
    ERP_NAME: "BJ ONE ERP",
    ERP_VERSION: "4.0.1",
    SCHOOL_CODE: "BJPS",
    ACADEMIC_YEAR: "2026-27",

    // Google Authentication
    GOOGLE_CLIENT_ID:
        "594079296208-rrfpja5335vp8cv9vt8fnofub0au20pb.apps.googleusercontent.com",

    // Google Apps Script Web App
    API_URL:
        "https://script.google.com/macros/s/AKfycbwDZFT3qHy0upPtqCyB0krbXFV25f_kYwAoBhQTyfuAcBe4whpl9xkZqeCavzUZ5eCt/exec",

    // Pages
    LOGIN_PAGE: "login.html",
    DASHBOARD_PAGE: "dashboard.html",

    // Session Keys
    STORAGE: {
        TOKEN: "google_token",
        USER_NAME: "user_name",
        USER_EMAIL: "user_email",
        USER_ROLE: "user_role"
    },

    // Theme
    THEME: {
        PRIMARY: "#C62828",
        SECONDARY: "#8E0000",
        SUCCESS: "#2E7D32",
        WARNING: "#F9A825",
        DANGER: "#C62828",
        BACKGROUND: "#F5F5F5",
        CARD: "#FFFFFF",
        TEXT: "#333333"
    },

    // Regional Settings
    TIMEZONE: "Asia/Kolkata",
    DATE_FORMAT: "dd/MM/yyyy",
    CURRENCY: "INR",
    LANGUAGE: "en-IN",

    // Application Settings
    ENABLE_DEBUG: true,
    SESSION_TIMEOUT: 60,
    AUTO_REFRESH: false
};

Object.freeze(CONFIG);
Object.freeze(CONFIG.STORAGE);
Object.freeze(CONFIG.THEME);

console.log(`${CONFIG.ERP_NAME} v${CONFIG.ERP_VERSION} Loaded`);
