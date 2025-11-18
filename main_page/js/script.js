document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const user = localStorage.getItem("user");

    if (user) {
        loginBtn.textContent = "Profile";
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert(`Welcome back, ${user}!`);
        });
    } else {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const username = prompt("Enter your username:");
            if (username) {
                localStorage.setItem("user", username);
                loginBtn.textContent = "Profile";
                alert(`Welcome, ${username}!`);
            }
        });
    }
});
