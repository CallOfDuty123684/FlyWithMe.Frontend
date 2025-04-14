// Load Google API
function loadGoogleAuth() {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize Google Sign-In
function initGoogleSignIn(clientId) {
    window.onload = () => {
        if (window.google) {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleLoginSuccess
            });

            google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large" }
            );
        } else {
            console.error("Google API script not loaded.");
        }
    };
}

// Handle Successful Login
function handleLoginSuccess(response) {
    const credential = response.credential;
    const user = JSON.parse(atob(credential.split(".")[1])); // Decode JWT

    // Store User Data in Local Storage
    localStorage.setItem("user", JSON.stringify(user));

    // Update Dashboard UI
    showUserDetails(user);
}

// Show User Details
function showUserDetails(user) {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = `
        <div class="user-info">
            <img src="${user.picture}" alt="Profile" class="profile-pic">
            <h2>${user.name}</h2>
            <p>${user.email}</p>
            <button onclick="logout()">Logout</button>
        </div>
    `;
}

// Logout Function
function logout() {
    localStorage.removeItem("user");
    document.getElementById("dashboard").innerHTML = `<p>You are logged out.</p>`;
}

// Load Google Auth
loadGoogleAuth();
initGoogleSignIn("188235371851-qalfb29ks3d3ouupv8a4kv6a3np2ua2t.apps.googleusercontent.com");
