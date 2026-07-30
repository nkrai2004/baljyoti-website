/*
=========================================================
BJ ONE ERP
File        : api.js
Version     : 4.0.0
Description : Google Apps Script API Layer
=========================================================
*/

"use strict";

const API = {

    baseURL: CONFIG.API_URL,

    async request(action, data = {}) {

        try {

            const payload = {
                action: action,
                ...data
            };

            const response = await fetch(this.baseURL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            if (!response.ok) {

                throw new Error(
                    "HTTP Error : " + response.status
                );

            }

            const result = await response.json();

            return result;

        } catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message

            };

        }

    },

    async login(idToken) {

        return await this.request("login", {

            token: idToken

        });

    },

    async dashboard() {

        return await this.request("dashboard");

    },

    async getAdmissions() {

        return await this.request("getAdmissions");

    },

    async getAdmission(id) {

        return await this.request("getAdmission", {

            id: id

        });

    },

    async createAdmission(data) {

        return await this.request(

            "createAdmission",

            data

        );

    },

    async updateAdmission(data) {

        return await this.request(

            "updateAdmission",

            data

        );

    },

    async deleteAdmission(id) {

        return await this.request(

            "deleteAdmission",

            {

                id: id

            }

        );

    },

    async uploadPhoto(base64Image) {

        return await this.request(

            "uploadPhoto",

            {

                image: base64Image

            }

        );

    },

    async getStudents() {

        return await this.request(

            "getStudents"

        );

    },

    async getAttendance(date) {

        return await this.request(

            "getAttendance",

            {

                date: date

            }

        );

    },

    async saveAttendance(data) {

        return await this.request(

            "saveAttendance",

            data

        );

    },

    async getFees() {

        return await this.request(

            "getFees"

        );

    },

    async saveFee(data) {

        return await this.request(

            "saveFee",

            data

        );

    },

    async getStaff() {

        return await this.request(

            "getStaff"

        );

    },

    async getTransport() {

        return await this.request(

            "getTransport"

        );

    },

    async getLibrary() {

        return await this.request(

            "getLibrary"

        );

    },

    async getInventory() {

        return await this.request(

            "getInventory"

        );

    },

    async reports(type) {

        return await this.request(

            "reports",

            {

                report: type

            }

        );

    }

};
