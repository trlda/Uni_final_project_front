document.addEventListener("DOMContentLoaded", async function() {
    document.getElementById('login-form').onsubmit = async function(e) {
        e.preventDefault();

        const status = document.getElementById('login-status');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch("http://127.0.0.1:8000/auth/login/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("username", username);

            window.location.href = "main_page.html";
        } else {
            status.textContent = "Login failed!";
        }
    };
});
