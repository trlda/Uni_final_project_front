let fiatRates = {};
let userFee = 0.05;

async function loadUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const res = await fetch("http://127.0.0.1:8000/auth/me/", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const user = await res.json();

    if (user.status === "VIP") {
        userFee = 0.015;
    } else {
        userFee = 0.05;
    }
}

async function loadFiat() {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    fiatRates = { USD: 1, EUR: data.rates.EUR };
}

async function getCryptoPrice(symbol) {
    const res = await fetch(`http://127.0.0.1:8000/prices/?symbol=${symbol}`);
    const data = await res.json();
    return data.price;
}

async function getPrice(symbol) {
    if (fiatRates[symbol]) return 1 / fiatRates[symbol];
    return await getCryptoPrice(symbol);
}

async function convert() {
    const amount = parseFloat(fromAmount.value);
    if (!amount) return;

    const fromP = await getPrice(fromCurrency.value);
    const toP = await getPrice(toCurrency.value);

    const result = (amount * fromP / toP) * (1 - userFee);
    toAmount.value = result.toFixed(8);

    rateInfo.innerHTML = `Fee: ${(userFee * 100).toFixed(1)}%`;
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadUser();
    await loadFiat();

    fromAmount.oninput = convert;
    fromCurrency.onchange = convert;
    toCurrency.onchange = convert;
});

convert()