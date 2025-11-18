document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("access_token");

    if (token && username) {
        loginBtn.textContent = username;
        loginBtn.href = "profile.html";

        logoutBtn.classList.remove("hidden");
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("username");
            window.location.href = "index.html";
        });
    } else {
        loginBtn.textContent = "Login";
        loginBtn.href = "login.html";
        logoutBtn.classList.add("hidden");
    }
});


