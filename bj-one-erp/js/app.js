/*
=========================================================
BJ ONE ERP
File        : app.js
Version     : 4.0.0
Date        : 30 July 2026
Author      : Nishant Rai & ChatGPT
Description : Main Application Controller
=========================================================
*/

"use strict";

const App = {

    currentModule: "dashboard",

    modules: [

        {
            id: "dashboard",
            name: "Dashboard",
            icon: "🏠"
        },

        {
            id: "admission",
            name: "Admissions",
            icon: "🎓"
        },

        {
            id: "students",
            name: "Students",
            icon: "👨‍🎓"
        },

        {
            id: "attendance",
            name: "Attendance",
            icon: "📅"
        },

        {
            id: "fees",
            name: "Fees",
            icon: "💰"
        },

        {
            id: "staff",
            name: "Staff",
            icon: "👨‍🏫"
        },

        {
            id: "transport",
            name: "Transport",
            icon: "🚌"
        },

        {
            id: "library",
            name: "Library",
            icon: "📚"
        },

        {
            id: "inventory",
            name: "Inventory",
            icon: "📦"
        },

        {
            id: "reports",
            name: "Reports",
            icon: "📊"
        }

    ],

    init() {

        this.checkLogin();

        this.buildSidebar();

        this.showWelcome();

    },

    checkLogin() {

        if (!sessionStorage.getItem(CONFIG.STORAGE.TOKEN)) {

            window.location.href = CONFIG.LOGIN_PAGE;

        }

    },

    buildSidebar() {

        const menu = document.getElementById("sidebarMenu");

        if (!menu) return;

        menu.innerHTML = "";

        this.modules.forEach(module => {

            const li = document.createElement("li");

            li.innerHTML = `${module.icon} ${module.name}`;

            li.className =
                module.id === this.currentModule
                ? "active"
                : "";

            li.onclick = () => {

                this.openModule(module.id);

            };

            menu.appendChild(li);

        });

    },

    openModule(moduleId) {

        this.currentModule = moduleId;

        this.buildSidebar();

        if (moduleId === "dashboard") {

            location.reload();

            return;

        }

        const content = document.getElementById("mainContent");

        if (!content) return;

        content.innerHTML = `

            <div class="page-title">

                ${this.getModuleName(moduleId)}

            </div>

            <div class="section">

                <h3>${this.getModuleName(moduleId)}</h3>

                <p>

                    This module is under development.

                </p>

                <br>

                <button class="btn"
                        onclick="location.reload()">

                    Back to Dashboard

                </button>

            </div>

        `;

    },

    getModuleName(id) {

        const module = this.modules.find(m => m.id === id);

        return module ? module.name : id;

    },

    showWelcome() {

        const welcome = document.getElementById("welcomeUser");

        if (!welcome) return;

        const userName =
            sessionStorage.getItem(CONFIG.STORAGE.USER_NAME);

        if (userName) {

            welcome.innerHTML =
                "Welcome <strong>" +
                userName +
                "</strong>";

        }

    },

    logout() {

        if (confirm("Are you sure you want to logout?")) {

            Auth.logout();

        }

    }

};

window.addEventListener("load", function () {

    App.init();

});
