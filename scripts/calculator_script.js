let fiatRates = {};
let userFee = 0.05;

async function loadUser() {
    try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            console.error('User not logged in');
            return;
        }
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.user_id;
        
        if (!userId) {
            console.error('User ID not found in token');
            return;
        }
        
        const res = await fetch(`http://127.0.0.1:8000/auth/user/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            if (res.status === 401) {
                console.error('Token expired or invalid');
                localStorage.removeItem('access');
            }
            throw new Error(`Failed to load user: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.status === "VIP") {
            userFee = 0.015;
        } else {
            userFee = 0.05;
        }
        
    } catch (error) {
        console.error('Error loading user:', error);
        userFee = 0.05;
    }
}

async function getCryptoPrice(currency) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/prices/?symbol=${currency}`);
        
        if (!res.ok) {
            throw new Error(`Failed to fetch price for ${currency}`);
        }
        
        const data = await res.json();
        return data.price;
    } catch (error) {
        console.error('Error loading crypto:', error);
        return null;
    }
}

async function loadFiat() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!res.ok) {
            throw new Error('Failed to fetch fiat rates');
        }
        
        const data = await res.json();
        fiatRates = {
            USD: 1,
            EUR: data.rates.EUR,
        };
    } catch (error) {
        console.error('Error loading fiat:', error);
    }
}

async function getPrice(currency) {
    if (fiatRates[currency]) {
        return 1 / fiatRates[currency];
    }
    
    return await getCryptoPrice(currency);
}

async function convert() {
    const amount = parseFloat(document.getElementById('fromAmount').value);
    
    if (!amount || amount === 0) {
        document.getElementById('toAmount').value = '';
        document.getElementById('rateInfo').innerHTML = '<span>Enter amount</span>';
        return;
    }
    
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    
    document.getElementById('rateInfo').innerHTML = '<span>Calculating...</span>';
    
    const fromPrice = await getPrice(from);
    const toPrice = await getPrice(to);
    
    if (!fromPrice || !toPrice) {
        document.getElementById('rateInfo').innerHTML = '<span>Error loading prices</span>';
        return;
    }
    
    const usdAmount = amount * fromPrice;
    const result = (usdAmount / toPrice) * (1 - userFee);
    
    document.getElementById('toAmount').value = result.toFixed(8);
    
    const feePercent = (userFee * 100).toFixed(1);
    let userType;
    
    if (userFee === 0.015) {
        userType = 'VIP';
    } else {
        userType = 'DEFAULT';
    }
    
    document.getElementById('rateInfo').innerHTML = 
        `<span>Fee: ${feePercent}% (${userType})</span>`;
}

function swap() {
    const from = document.getElementById('fromCurrency');
    const to = document.getElementById('toCurrency');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
    convert();
}

async function init() {
    document.getElementById('rateInfo').innerHTML = '<span>Loading...</span>';
    
    try {
        await loadUser();
        await loadFiat();
        
        document.getElementById('fromAmount').addEventListener('input', convert);
        document.getElementById('fromCurrency').addEventListener('change', convert);
        document.getElementById('toCurrency').addEventListener('change', convert);
        document.getElementById('swapBtn').addEventListener('click', swap);
        
        convert();
        
        setInterval(async () => {
            await loadFiat();
            convert();
        }, 300000);
        
    } catch (error) {
        console.error('Init error:', error);
        document.getElementById('rateInfo').innerHTML = '<span>Error loading data</span>';
    }
}

document.addEventListener('DOMContentLoaded', init);