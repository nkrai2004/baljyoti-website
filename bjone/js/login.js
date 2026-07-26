/*****************************************************
 * BJ ONE Login
 * Bal Jyoti Public School
 *****************************************************/

const API_URL =
"https://script.google.com/macros/s/AKfycbzHI4gDpZEOPNYr1JJn1SnDlJeWa_ldYLkcFijg7ql8NwoAmq6ZknPCjIvw6Bm_uOhzWg/exec";

function handleCredentialResponse(response) {

    try {

        // Decode Google Login Token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        const email = payload.email;

        document.getElementById("status").innerHTML =
            "Checking user permissions...";

        fetch(API_URL + "?email=" + encodeURIComponent(email))
        .then(res => res.json())
        .then(user => {

            console.log(user);

            if (!user.success) {

                alert("User is not authorised.");

                return;

            }

            // Save User Session
            sessionStorage.setItem("userName", user.name);
            sessionStorage.setItem("userRole", user.role);
            sessionStorage.setItem("userEmail", user.email);
            sessionStorage.setItem("userStatus", user.status);
            sessionStorage.setItem("userDashboard", user.dashboard);
            sessionStorage.setItem("userModules", JSON.stringify(user.modules));

            // Open Main Application
            window.location.href = "app.html";

        })

        .catch(error => {

            console.error(error);

            alert("Unable to connect to BJ ONE Server.");

        });

    }

    catch(err){

        console.error(err);

        alert("Google Login Failed.");

    }

}
