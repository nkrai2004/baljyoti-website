/*
=========================================================
BJ ONE ERP
File : app.js
Version : 5.0
=========================================================
*/

"use strict";

const App = {

    currentModule: "dashboard",

    modules: [],

    init() {

        this.checkLogin();

        this.buildSidebar();

        this.showWelcome();

    },

  async init() {

    this.checkLogin();

    const role = sessionStorage.getItem(CONFIG.STORAGE.USER_ROLE);

    const result = await API.modules(role);

    if (result.success) {

        this.modules = result.data;

    }

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

            if (module.id === this.currentModule) {

                li.classList.add("active");

            }

            li.onclick = () => this.openModule(module.id);

            menu.appendChild(li);

        });

    },

    async openModule(moduleId) {

        this.currentModule = moduleId;

        this.buildSidebar();

        if (moduleId === "dashboard") {

            location.reload();

            return;

        }

        const content = document.getElementById("mainContent");

        try {

            const response = await fetch(`modules/${moduleId}.html`);

            if (!response.ok) {

                throw new Error("Unable to load module.");

            }

            const html = await response.text();

            content.innerHTML = html;

            // CSS Loader

            let css = document.getElementById("module-css");

            if (!css) {

                css = document.createElement("link");

                css.rel = "stylesheet";

                css.id = "module-css";

                document.head.appendChild(css);

            }

            css.href = `css/${moduleId}.css?v=${Date.now()}`;

            // JS Loader

            const oldScript = document.getElementById("module-js");

            if (oldScript) {

                oldScript.remove();

            }

            const script = document.createElement("script");

            script.src = `js/${moduleId}.js?v=${Date.now()}`;

            script.id = "module-js";

            document.body.appendChild(script);

        }

        catch (error) {

            console.error(error);

            content.innerHTML = `
                <div class="section">
                    <h3>Error</h3>
                    <p>${error.message}</p>
                </div>
            `;

        }

    },

    showWelcome() {

        const welcome = document.getElementById("welcomeUser");

        if (!welcome) return;

        const name = sessionStorage.getItem(CONFIG.STORAGE.USER_NAME);

        if (name) {

            welcome.innerHTML = `Welcome <strong>${name}</strong>`;

        }

    },

    logout() {

        if (confirm("Logout from BJ ONE ERP?")) {

            Auth.logout();

        }

    }

};

window.onload = function () {

    App.init();

};
