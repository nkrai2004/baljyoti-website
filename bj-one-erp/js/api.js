/*
=========================================================
BJ ONE ERP
api.js
Version 6.0
=========================================================
*/

"use strict";

const API = {

    baseURL: CONFIG.API_URL,

    async get(action, params = {}) {

        const url = new URL(this.baseURL);

        url.searchParams.append("action", action);

        Object.keys(params).forEach(key => {

            if (params[key] !== undefined && params[key] !== null) {

                url.searchParams.append(key, params[key]);

            }

        });

        try {

            const response = await fetch(url);

            return await response.json();

        }

        catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message

            };

        }

    },

    /*==========================
      Authentication
    ==========================*/

    login(email) {

        return this.get("login", {

            email: email

        });

    },

    modules(role) {

        return this.get("roleModules", {

            role: role

        });

    },

    /*==========================
      Dashboard
    ==========================*/

    dashboard() {

        return this.get("dashboard");

    },

    users() {

        return this.get("users");

    },

    roles() {

        return this.get("roles");

    },

    config() {

        return this.get("config");

    },

    /*==========================
      Admission Leads
    ==========================*/

    admissionLeads() {

        return this.get("admissionLeads");

    },

    /*==========================
      Admissions
    ==========================*/

    getAdmissions() {

        return this.get("getAdmissions");

    },

    saveAdmission(data) {

        return this.get("saveAdmission", data);

    },

    updateAdmission(data) {

        return this.get("updateAdmission", data);

    },

    deleteAdmission(admissionNo) {

        return this.get("deleteAdmission", {

            admissionNo: admissionNo

        });

    },

    /*==========================
      Students
    ==========================*/

    getStudents() {

        return this.get("students");

    },

    saveStudent(data) {

        return this.get("saveStudent", data);

    },

    updateStudent(data) {

        return this.get("updateStudent", data);

    },

    deleteStudent(studentId) {

        return this.get("deleteStudent", {

            studentId: studentId

        });

    }

};
