document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("verify-form");
    const status = document.getElementById("status");

    email = localStorage.getItem("verify_email");
    
    if (!email) {
        status.style.color = "red";
        status.textContent = "Email not found. Please register again.";
        return;
    }

    form.onsubmit = async function (e) {
        e.preventDefault();

        const verificationCode = document.getElementById("verification_code").value;

        if (!verificationCode || verificationCode.length !== 6) {
            status.style.color = "red";
            status.textContent = "Please enter a valid 6-digit code.";
            return;
        }

        const response = await fetch("http://127.0.0.1:8000/auth/verify-code/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                code: verificationCode
            })
        });

        if (response.ok) {
            status.style.color = "lime";
            status.textContent = "Email verified successfully!";

            localStorage.removeItem("verify_email");

            window.location.href = "login.html";
        } else {
            status.style.color = "red";
            status.textContent = "Verification failed! Please check your code.";
        }
    }
});

