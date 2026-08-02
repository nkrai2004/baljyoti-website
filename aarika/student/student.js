import app from "../config/firebase-init.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "/aarika/";

        return;

    }

    const studentName = document.getElementById("studentName");

    if (studentName) {

        studentName.textContent = `Welcome, ${user.displayName}`;

    }

});

const missionTitle = document.getElementById("missionTitle");
const missionDescription = document.getElementById("missionDescription");

if (missionTitle && missionDescription) {

    missionTitle.textContent = "Mathematics - Linear Equations";

    missionDescription.textContent =
        "Complete 10 adaptive questions and improve your problem-solving skills.";

}
