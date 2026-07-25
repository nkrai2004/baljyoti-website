function handleCredentialResponse(response) {

    // Display a message
    document.getElementById("status").innerHTML = "Signing in...";

    // Print the Google ID token in the browser console
    console.log("Google Credential:", response.credential);

    // For now, just move to the dashboard
    window.location.href = "dashboard.html";
}
