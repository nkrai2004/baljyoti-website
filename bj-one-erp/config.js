
/*=========================================================
BJ ONE ERP
File        : config.js
Version     : 1.0.0
Date        : 27 July 2026
Author      : Nishant Rai & ChatGPT
Description : Global Configuration File
=========================================================*/

"use strict";

/*---------------------------------------------------------
APPLICATION CONFIGURATION
---------------------------------------------------------*/

const CONFIG = {

    /*---------------------------------------------
      APPLICATION
    ---------------------------------------------*/

    APP_NAME: "BJ ONE ERP",

    APP_VERSION: "1.0.0",

    SCHOOL_NAME: "Bal Jyoti Public School",

    SCHOOL_DOMAIN: "baljyoti.com",

    COPYRIGHT: "© 2026 Bal Jyoti Public School",

    THEME: "RED_WHITE",

    /*---------------------------------------------
      GOOGLE WORKSPACE
    ---------------------------------------------*/

    GOOGLE_CLIENT_ID:
        "594079296208-rrfpja5335vp8cv9vt8fnofub0au20pb.apps.googleusercontent.com",

    ALLOWED_DOMAIN:
        "baljyoti.com",

    /*---------------------------------------------
      GITHUB
    ---------------------------------------------*/

    GITHUB_URL:
        "https://nkrai2004.github.io/baljyoti-website/bj-one-erp/",

    /*---------------------------------------------
      GOOGLE APPS SCRIPT
      (Update after deployment)
    ---------------------------------------------*/

    API_URL:
        "",

    /*---------------------------------------------
      DATABASE
    ---------------------------------------------*/

    DATABASE_NAME:
        "BJ ONE Master Database",

    /*---------------------------------------------
      LOGIN
    ---------------------------------------------*/

    LOGIN_PAGE:
        "login.html",

    DASHBOARD_PAGE:
        "dashboard.html",

    /*---------------------------------------------
      SESSION
    ---------------------------------------------*/

    SESSION_TIMEOUT:
        30,

    REMEMBER_LOGIN:
        true

};

/*---------------------------------------------------------
MODULES
---------------------------------------------------------*/

const MODULES = {

    DASHBOARD: "Dashboard",

    STUDENTS: "Students",

    ADMISSION: "Admission",

    STAFF: "Staff",

    ATTENDANCE: "Attendance",

    FEES: "Fees",

    EXAMINATION: "Examination",

    TRANSPORT: "Transport",

    LIBRARY: "Library",

    INVENTORY: "Inventory",

    REPORTS: "Reports",

    SETTINGS: "Settings"

};

/*---------------------------------------------------------
ROLES
---------------------------------------------------------*/

const ROLES = {

    SUPER_ADMIN: "Super Admin",

    DIRECTOR: "Director",

    PRINCIPAL: "Principal",

    VICE_PRINCIPAL: "Vice Principal",

    ADMIN: "Admin",

    ACCOUNTS: "Accounts",

    HR: "HR",

    TEACHER: "Teacher",

    LIBRARIAN: "Librarian",

    TRANSPORT: "Transport",

    PARENT: "Parent",

    STUDENT: "Student"

};

/*---------------------------------------------------------
STATUS
---------------------------------------------------------*/

const STATUS = {

    ACTIVE: "Active",

    INACTIVE: "Inactive",

    BLOCKED: "Blocked",

    PENDING: "Pending"

};

/*---------------------------------------------------------
COLORS
---------------------------------------------------------*/

const COLORS = {

    PRIMARY: "#C62828",

    PRIMARY_DARK: "#8E0000",

    WHITE: "#FFFFFF",

    LIGHT: "#F5F5F5",

    SUCCESS: "#2E7D32",

    WARNING: "#F9A825",

    ERROR: "#C62828",

    INFO: "#1565C0"

};

/*---------------------------------------------------------
COMMON FUNCTIONS
---------------------------------------------------------*/

function appName() {

    return CONFIG.APP_NAME;

}

function appVersion() {

    return CONFIG.APP_VERSION;

}

function schoolName() {

    return CONFIG.SCHOOL_NAME;

}

function dashboardPage() {

    return CONFIG.DASHBOARD_PAGE;

}

function loginPage() {

    return CONFIG.LOGIN_PAGE;

}

function apiUrl() {

    return CONFIG.API_URL;

}

function googleClientId() {

    return CONFIG.GOOGLE_CLIENT_ID;

}

function allowedDomain() {

    return CONFIG.ALLOWED_DOMAIN;

}

console.log("-------------------------------------");
console.log(CONFIG.APP_NAME);
console.log("Version :", CONFIG.APP_VERSION);
console.log(CONFIG.SCHOOL_NAME);
console.log("-------------------------------------");
