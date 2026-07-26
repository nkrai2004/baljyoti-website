/*****************************************************
 * BJ ONE Login
 * Bal Jyoti Public School
 *****************************************************/

const API_URL =
  "https://script.google.com/macros/s/AKfycbzHI4gDpZEOPNYr1JJn1SnDlJeWa_ldYLkcFijg7ql8NwoAmq6ZknPCjIvw6Bm_uOhzWg/exec";

function handleCredentialResponse(response) {

    try {

        // Decode Google JWT
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        const email = payload.email;

        document.getElementById("status").innerHTML =
            "Checking user permissions...";

        fetch(API_URL + "?email=" + encodeURIComponent(email))
            .then(res => res.json())
            .then(user => {

                console.log("API Response:", user);

                if (!user.success) {
                    alert("User is not authorised.");
                    return;
                }

                // ===========================
                // Save User Session
                // ===========================

                sessionStorage.setItem("userName", user.name);
                sessionStorage.setItem("userRole", user.role);
                sessionStorage.setItem("userEmail", user.email);
                sessionStorage.setItem("userStatus", user.status);
                sessionStorage.setItem("userDashboard", user.dashboard);

                // Save Modules Array
                sessionStorage.setItem(
                    "userModules",
                    JSON.stringify(user.modules)
                );

                console.log(
                    "Modules Saved:",
                    JSON.parse(sessionStorage.getItem("userModules"))
                );

                // Redirect
                window.location.href = "dashboard.html";

            })
            .catch(error => {

                console.error(error);

                alert("Unable to connect to server.");

            });

    } catch (err) {

        console.error(err);

        alert("Google Login Failed.");

    }

}
