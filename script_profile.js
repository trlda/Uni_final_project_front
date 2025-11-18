document.addEventListener('DOMContentLoaded', function() {
    const connectButtons = document.querySelectorAll('.connect-btn');

    connectButtons.forEach(function(button) {
        button.addEventListener('click', async function() {
            const symbol = this.getAttribute('data-symbol');
            const addressInput = document.getElementById(`${symbol}Address`);
            const balanceDisplay = document.getElementById(`${symbol}Balance`);

            const address = addressInput.value.trim();

            if (!address) {
                alert(`Input address ${symbol} wallet`);
                return;
            }
            balanceDisplay.textContent = 'Loading...';

            try {
                const url = `http://127.0.0.1:8000/balance/?symbol=${symbol}&address=${address}`;
                const response = await fetch(url);
                const data = await response.json();
                balanceDisplay.textContent = `Balance: ${data.balance} ${data.symbol}`;
            } catch (error) {
                console.error(error);
                balanceDisplay.textContent = 'Error loading balance';
            }
        });
    });
});