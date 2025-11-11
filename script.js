document.addEventListener('DOMContentLoaded', function() {
    const connectButtons = document.querySelectorAll('.connect-btn');

    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currency = this.getAttribute('data-currency');
            const addressInput = document.getElementById(`${currency.toLowerCase()}Address`);
            const balanceDisplay = document.getElementById(`${currency.toLowerCase()}Balance`);

            const address = addressInput.value.trim();

            if (!address) {
                alert(`Input address ${currency} wallet`);
                return;
            }
            balanceDisplay.textContent = 'Loading...';

            checkBalance(currency, address, balanceDisplay);
        });
    });

    function checkBalance(currency, address, balanceDisplay) {
        const url = `http://127.0.0.1:8000/balance/?symbol=${currency}&address=${address}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                balanceDisplay.textContent = `Balance: ${data.balance} ${data.symbol}`;
            })
            .catch(error => {
                console.error('Error:', error);
                balanceDisplay.textContent = 'Error loading balance';
            });
    }
});