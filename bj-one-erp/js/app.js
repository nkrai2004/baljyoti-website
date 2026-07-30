/*
=========================================================
BJ ONE ERP
File        : app.js
Version     : 3.0
Description : Main Application Controller
=========================================================
*/

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

        console.log("BJ ONE ERP Started");

        this.buildSidebar();

        this.showWelcome();

    },

    buildSidebar() {

        const menu = document.getElementById("sidebarMenu");

        if (!menu) return;

        menu.innerHTML = "";

        this.modules.forEach(module => {

            const li = document.createElement("li");

            li.innerHTML = `${module.icon} ${module.name}`;

            li.dataset.module = module.id;

            if (module.id === this.currentModule) {
                li.style.background = "#C62828";
            }

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

        alert(moduleId + " module will be connected in next steps.");

    },

    showWelcome() {

        const user = JSON.parse(localStorage.getItem("bjUser"));

        const box = document.getElementById("welcomeUser");

        if (!box) return;

        if (user) {

            box.innerHTML =
                "Welcome <b>" +
                user.name +
                "</b>";

        }

    },

    logout() {

        localStorage.removeItem("bjUser");

        window.location.href = "login.html";

    }

};

window.onload = () => {

    App.init();

};
