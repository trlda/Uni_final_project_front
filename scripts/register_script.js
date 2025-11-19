document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");
    const status = document.getElementById("status");

    form.onsubmit = async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone_number").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        const response = await fetch("http://127.0.0.1:8000/auth/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                email,
                phone_number: phone,
                password,
                password2
            })
        });

        if (response.ok) {
            status.style.color = "lime";
            status.textContent = "Registration successful!";
        } else {
            status.style.color = "red";
            status.textContent = "Registration failed!";
        }
    };
});
