const API_URL = "https://script.google.com/macros/s/AKfycbzHI4gDpZEOPNYr1JJn1SnDlJeWa_ldYLkcFijg7ql8NwoAmq6ZknPCjIvw6Bm_uOhzWg/exec";

function handleCredentialResponse(response) {

    // Decode Google JWT
    const payload = JSON.parse(atob(response.credential.split('.')[1]));

    // Get logged in email
    const email = payload.email;

    document.getElementById("status").innerHTML = "Checking user...";

    fetch(API_URL + "?email=" + encodeURIComponent(email))
        .then(response => response.json())
        .then(user => {

            if (user.success === true) {

                sessionStorage.setItem("userName", user.name);
                sessionStorage.setItem("userRole", user.role);
                sessionStorage.setItem("userEmail", user.email);
                sessionStorage.setItem("userDashboard", user.dashboard);

                window.location.href = "dashboard.html";

            } else {

                alert("User not found.");

            }

        })
        .catch(error => {

            console.log(error);
            alert("Server Error");

        });

}
