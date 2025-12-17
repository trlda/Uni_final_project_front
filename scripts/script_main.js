document.addEventListener("DOMContentLoaded", async function () {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const vipBtn = document.getElementById("vip-btn");
    const vipMessage = document.getElementById("vip-message");
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const params = new URLSearchParams(window.location.search);

    if (params.get("vip") === "success") {
        if (vipMessage) {
            vipMessage.classList.remove("hidden");
            vipMessage.textContent = "VIP successfully activated!";
        }
        window.history.replaceState({}, document.title, "main_page.html");
    }

    if (params.get("vip") === "error") {
        alert("VIP payment failed");
        window.history.replaceState({}, document.title, "main_page.html");
    }

    if (token && username) {
        loginBtn.textContent = username;
        loginBtn.onclick = () => window.location.href = "profile.html";

        logoutBtn.classList.remove("hidden");
        logoutBtn.onclick = function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "main_page.html";
        };
    } else {
        loginBtn.textContent = "Login";
        loginBtn.onclick = () => window.location.href = "login.html";
        logoutBtn.classList.add("hidden");
    }

    if (token) {
        try {
            const res = await fetch("http://127.0.0.1:8000/auth/me/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const user = await res.json();

                if (user.status === "VIP" && vipBtn) {
                    vipBtn.style.display = "none";
                }
            }
        } catch (error) {
            console.error("Failed to load user info", error);
        }
    }

    if (vipBtn) {
        vipBtn.addEventListener("click", function () {
            if (!token) {
                alert("Please login to buy VIP");
                window.location.href = "login.html";
                return;
            }

            window.location.href = "http://127.0.0.1:8000/payments/vip/create/";
        });
    }
});
