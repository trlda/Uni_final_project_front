document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("You are not authorized");
        return;
    }

    loadWallets();

    document.querySelectorAll(".connect-btn").forEach(btn => {
        btn.addEventListener("click", () => connectWallet(btn.dataset.symbol));
    });
});

async function loadWallets() {
    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/wallets/", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const wallets = await res.json();

    wallets.forEach(w => {
        document.getElementById(`${w.symbol}Address`).value = w.address;
        loadBalance(w.symbol, w.address);
        addDisconnectButton(w.symbol);
    });
}

async function connectWallet(symbol) {
    const token = localStorage.getItem("access_token");
    const address = document.getElementById(`${symbol}Address`).value.trim();

    if (!address) {
        alert("Enter wallet address");
        return;
    }

    await fetch("http://127.0.0.1:8000/wallets/connect/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ symbol, address })
    });

    loadBalance(symbol, address);
    addDisconnectButton(symbol);
}

async function disconnectWallet(symbol) {
    const token = localStorage.getItem("access_token");

    await fetch(`http://127.0.0.1:8000/wallets/disconnect/${symbol}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    document.getElementById(`${symbol}Address`).value = "";
    document.getElementById(`${symbol}Balance`).innerText = "";
    document.getElementById(`${symbol}Disconnect`)?.remove();
}

async function loadBalance(symbol, address) {
    const res = await fetch(
        `http://127.0.0.1:8000/balance/?symbol=${symbol}&address=${address}`
    );
    const data = await res.json();

    document.getElementById(`${symbol}Balance`).innerText =
        `Balance: ${data.balance} ${data.symbol}`;
}

function addDisconnectButton(symbol) {
    if (document.getElementById(`${symbol}Disconnect`)) return;

    const btn = document.createElement("button");
    btn.id = `${symbol}Disconnect`;
    btn.innerText = "Disconnect";
    btn.className = "connect-btn";
    btn.onclick = () => disconnectWallet(symbol);

    document
        .getElementById(`${symbol}Balance`)
        .parentElement.appendChild(btn);
}
