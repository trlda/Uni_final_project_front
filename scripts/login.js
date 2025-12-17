document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-form").onsubmit = async (e) => {
        e.preventDefault();

        const statusEl = document.getElementById("login-status");
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch("http://127.0.0.1:8000/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            statusEl.textContent = "Login failed";
            return;
        }

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("username", username);

        localStorage.setItem("user_status", data.status || "DEFAULT");

        window.location.href = "main_page.html";
    };
});
